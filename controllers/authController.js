// ----- importing from models ----- //
const User = require('../models/User'); 
const UserAT = require('../models/UserAccessToken'); 
const fetch = require('isomorphic-fetch');

const crypto = require('crypto'); 

// ----- importing from mailers ----- //
const passwordMailer = require('../mailers/reset_pass_mailer'); 
// ----- importing from worker ----- //
const resetPasswordWorker = require('../worker/reset_pass');
const queue = require('../config/kue');

const keys = require('../config/app_key');

// ----- using this Library for long datatype is being used in expiry time for access token link ----- //
const mongoose = require('mongoose'); 
require('mongoose-long')(mongoose); 
const {Types: {Long}} = mongoose; 

// ----- rendering login page ----- //
module.exports.Login_page = function(req, res) {
    
 //------ user is signed in don't show login page ----- //
    if(req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    
    return res.render('login');
}

// ----- rendering SignUp page ----- //
module.exports.Signup_page = function(req, res) {
    // ----- user is signed in don't show signup page ----- //
    if(req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }

    return res.render('register');
}


// ----- creating a new user ----- //
module.exports.Create_new_user = async function(req, res) {
    try{
        let user = await User.findOne({email : req.body.email});

        // ------ getting site key from client side ------ //
        const response_key = req.body["g-recaptcha-response"];

        // ------ Put secret key here, which we get from google console ------- //
        const secret_key = keys.key_values.re_captcha_secret_key;

        // ------ Hitting POST request to the URL, Google will respond with success or error scenario   ----- //
        const url =`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

        // ------ Making POST request to verify captcha -------- //
        fetch(url, {
            method: "POST",
        })
        .then((response) => response.json())
        .then((google_response) => {
           
            if (google_response.success == true) {
                
                if(req.body.password == req.body.confirm_password) {
                    req.flash('success', 'User registered successfully');
                                
                } else {
                   req.flash('error', 'Password does not match');  
                }

                if(!user) {
        
                    // ----- Create a new user ----- // 
                    let newUser = new User();
        
                    newUser.name = req.body.name;
                    newUser.email = req.body.email;
                    newUser.setPassword(req.body.password);
        
                    // ----- save new user ----- //
                    newUser.save((err, User) => {
                        
                        if(err) {
                            console.log('error at saving new user ', err);
                            return res.redirect('back'); 
                        }else {
                            req.flash('success', 'New User Created');
                            return res.redirect('/auth/login_page');
                        }
                    });
                }
                else {
                    return res.redirect('back');
                }

            } else {
                // ----- captcha is not verified ------ //
                req.flash('error', 'Please Verify captcha')
                return res.redirect('back');
            }
        });
    }catch(err){
        return res.redirect('back');
    }

}

// ------ Manual authentication for sign In ------ //
module.exports.Create_session_manual_Auth = function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            console.log('error at finding user in  sign in: ', err);
            return;
        }

        if(user) {
            if(user.password != req.body.password) {
                console.log('Invalid user / password')
                return res.redirect('back');
            }

            res.cookie('user_id', user.id);

            return res.redirect('users/profile');
        }else {
            console.log('user not found');
            return res.redirect('back');
        }
    });
}

// ----- Create a session using passport authentication ------ //
module.exports.Create_session_passport_Auth = function(req, res) {
    req.flash('success', 'Welcome ');
    return res.redirect('/dashboard');
}



// ----- Logout by destroying session created by passport using express-session ----- //
module.exports.Destroy_session = function(req, res) {
    req.logout(function(err) {
        if(err) {
            console.log(err || 'Logged out from session');
        }

        req.flash('success', 'See you soon');
        return res.redirect('/auth/login_page'); 
    }); 
}

// ------ Forgot password : Render ask email on req   ----- // 
module.exports.Reset_pass_page = function(req, res) {
    return res.render('reset_password');
}

// ------  Generate access token for a user ----- //
module.exports.Generate_access_token = async function(req, res) {
    try{
        let current_milliesec = new Date().getTime(); 
        current_milliesec = current_milliesec + (1000 * 60 * 5); 

        let user = await User.findOne({email: req.body.email});

        if(user) {
           
            let userWithAT = await UserAT.create({
                user: user,
                expiresAt: Long.fromNumber(current_milliesec),
                accessToken: crypto.randomBytes(20).toString('hex')
            });

            userWithAT = await userWithAT.populate('user', 'name email');
            
            // ----- add user with access token to mailer worker ------ //
            queue.create('NodeAuthPassResetEmail', userWithAT).save();
            console.log('Job Enqueued');


            return res.render('reset_password_link');
        }

    }catch(err) {
        console.log('AuthController: error at generating access token ', err);
    }
}

// -----  Verify access token using mongoDB ------ //
module.exports.VerifyAccessToken = async function(req, res) {
    try{
        let current_milliesec = new Date().getTime();

        let userWithAT = await UserAT.findOne({accessToken: req.params.id});

        // ----- User access Token is not available ------ //
        if(!userWithAT) {
            return res.render('invalid', {message: 'invalid link'});
        }

        // ------ if user's link is expired (5 min life) ------ //
        if(userWithAT.expiresAt < current_milliesec) {
            await UserAT.findOneAndUpdate({accessToken: req.params.id}, {isValid: false});
            return res.render('invalid', {message: 'Timeout: Link Expired'});
        }

        // ------ user's link is invalid -> clicked after updating password ------ //
        if(!userWithAT.isValid) {
            return res.render('invalid', {message: 'Link Expired'});
        }

        let user_id = userWithAT.user;
        let user = await User.findById(user_id);
        if(user) {
            return res.render('update_password', {user: user, userWithAT: userWithAT});
        }

        return res.render('invalid', {message: 'Invalid user'});

    }catch(err) {
        console.log('AuthController: error at verifying access token ', err);
    }
}

// ------- Update password using link send to user ------ //
module.exports.Update_password = async function(req, res) {

    if(req.body.password == req.body.confirm_password) {

        let user = await User.findOne({email: req.body.email});
        user.setPassword(req.body.password);

        user.save((err, User) => {
            if(err){
                console.log('error at updaing password');
                return redirect('back');
            }
        });
        
        if(user) {
            if(req.body.isLogged == 1) await UserAT.findOneAndUpdate({accessToken: req.body.accessToken}, {isValid: false});
            req.flash('success', 'password updated');
            return res.redirect('/dashboard');
        }
    }else {
        return;
    }
}

// ------ Render password page: ask password to re-verify user ------ //
module.exports.Password_page = function(req, res) {
    res.render('ask_password');
}

// ------ update password if password is correct or not ------ //
module.exports.Verify_user = function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if(err) {
            console.log('error at finding user in verify user: ', err);
            return;
        }
        if(user) {
            if(user == user.password) {
                req.flash('error', 'Wrong Password');
                return res.redirect('back');
            }else{
                req.flash('success', 'user verified');
                return res.render('update_password_login', {user: user});
            }

        }else {
            req.flash('error', 'user not found');
            return res.redirect('back');
        }
    });
}