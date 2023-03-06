const User = require('../models/User');

module.exports.profile = async function(req, res) {
    try{
        console.log('User Controller: At ASYNC ');

        let user = await User.findById(req.params.id);

        return res.render('profile', {user: user});
    }catch(err) {
        console.log('User Controller: Err At ASYNC ', err);
    }
}
