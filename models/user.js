const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String,
        default: 'https://www.pinterest.com/pin/default-instagram-pfp-di-2023--750553094172934444/'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT, { expiresIn: '7d' });
    return token;
}

const User = mongoose.model('User', UserSchema);
module.exports = User;