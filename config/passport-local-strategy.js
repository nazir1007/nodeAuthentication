// passport-local authentication , User Input authentication

// ------ Importing passport ------ //
const passport = require('passport'); 
const LocalStrategy = require('passport-local').Strategy; 

// ----- Importing models ----- //
const User = require('../models/User'); 
const fetch = require('isomorphic-fetch');
const keys = require('./app_key');

// ----- Authentication using passport ------ //
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, function(req, email, password, done) {

    // ----- getting site key from client side ----- //
    const response_key = req.body["g-recaptcha-response"];

    // -----  Put secret key here, which we get from google console ----- //
    const secret_key = keys.key_values.re_captcha_secret_key;

    // ------  Hitting POST request to the URL, Google will respond with success or error scenario. ------ //
    const url =`https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

    // Making POST request to verify captcha
    fetch(url, {
        method: "POST",
    })
    .then((response) => response.json())
    .then((google_response) => {
     
        if (google_response.success == true) {

            User.findOne({email: email}, function(err, user) {
                if(err) {
                    req.flash('error', 'Internal Server Error')
                    return done(err);
                }

                if(!user || user.notMatch(password)) {
                    req.flash('error', 'Invalid user / password')
                    return done(null, false);
                }

                return done(null, user);
            });
        } else {
            // -----  captcha is not verified ------ //
            req.flash('error', 'Please Verify captcha')
            return done(null, false);
        }
    })
    .catch((error) => {
        // ----- Some error while verify captcha ------ //
        console.log('error at captcha -> ', error);
        return done(null, false);
    });
}
));



// ------- serialize user function ------- //
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// ------- deserialize the user ------- //
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err) {
            console.log('Error : Passport config : finding user');
            return done(err);
        }

        return done(null, user);
    });
});

// ------ check if the user is authenticated ------ //
passport.checkAuthentication = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    // ------ user is not signed in ----- //
    return res.redirect('/auth/login_page');
}

// ------ there is a user logged In : Set this user as local user ------- //
passport.setAuthenticatedUser = function(req, res, next) {
    if(req.isAuthenticated()) {
       
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;