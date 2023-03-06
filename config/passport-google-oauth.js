// Passport is used for google Authentication

// ----- Importing  passport -----  //
const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy; 

// ----- create a random password using crypto ------ //
const crypto = require('crypto'); 

// ----- Importing models ----- //
const User = require('../models/User'); 
const keys = require('./app_key');

// ------ use google strategy for signing ------ //
passport.use(new googleStrategy({
        clientID: keys.key_values.g_client_id,
        clientSecret: keys.key_values.g_client_secret,
        callbackURL: keys.key_values.g_callback_url
    },
    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err) {
                console.log('err : passport google auth config ', err);
                return;
            }

            if(user) {
    // ------ if user is present in DB then logIn Directly ------ //
                return done(null, user);
            }else {
    // ------- In Case of User is not present in DB: Register this user in DB and Login ------ //
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user) {
                    if(err) {
                        console.log('err : passport google auth config ', err);
                        return;
                    }

                    return done(null, user);
                });
            }
        });
    }
));

module.exports = passport;