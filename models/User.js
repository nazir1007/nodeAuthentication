const mongoose = require("mongoose");
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
   hash: String,
   salt: String
}, {
    timestamps: true
});

UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString('hex');
}

UserSchema.methods.notMatch = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString('hex');
    return this.hash !== hash;
}
const User = mongoose.model('User', UserSchema, 'user');

module.exports = User;