const express = require('express'); 
const router = express.Router(); 
const passport = require('passport'); 

const authController = require('../controllers/authController');


// ----- Routes for Manual Authentication: Login, Signup, Logout ----- //     
router.post('/create_session', passport.authenticate('local',{ failureRedirect: '/auth/login_page'}),
             authController.Create_session_passport_Auth);
router.get('/login_page', authController.Login_page);
router.get('/signup_page', authController.Signup_page);
router.post('/create_new', authController.Create_new_user);
router.get('/sign-out', authController.Destroy_session);

// ----- Routes for Google Authentication: SignIn / SignUp ------//
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/google/callback', passport.authenticate
             ('google', {failureRedirect: '/auth/login_page'}),
              authController.Create_session_passport_Auth)

// ----- Routes for change password ----- //
router.get('/reset_pass_page', authController.Reset_pass_page);
router.post('/generate_accessToken', authController.Generate_access_token);
router.get('/verify_key/:id', authController.VerifyAccessToken);
router.post('/update_password', authController.Update_password);


// ----- Routes for update password ----- //
router.get('/render_pass', passport.checkAuthentication, authController.Password_page);
router.post('/verify_user', authController.Verify_user);


module.exports = router;