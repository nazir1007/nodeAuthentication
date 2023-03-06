const express = require('express'); 
const router = express.Router(); 
const passport = require('passport'); 

router.get('/', (req, res) => res.render('welcome'));

router.use('/dashboard', passport.checkAuthentication, require('./dashboard'));

// router.use('/users', passport.checkAuthentication, function(req, res){
//     res.redirect('./users')});


router.use('/users', passport.checkAuthentication, require('./users'));

router.use('/auth', require('./auth'));


module.exports = router;

