const mongoose = require('mongoose'); // get instance of mongoose
require('mongoose-long')(mongoose);
const {Types: {Long}} = mongoose;

const userAccessToken = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Long,
        required: true
    }
    ,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const UserWithAccessToken = mongoose.model('UserWithAccessToken', userAccessToken, 'UserWithAccessToken');

module.exports = UserWithAccessToken;