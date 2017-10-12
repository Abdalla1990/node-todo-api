const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
var bcryptjs = require('bcryptjs');
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a correct email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret').toString();
    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
};
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'secret');
    } catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};



// a middleware happening in the model level to hash the password before saving it : 

UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
        bcryptjs.genSalt(10, (err, salt) => {

            bcryptjs.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else { next(); }

});

var User = mongoose.model('User', UserSchema);

module.exports = { User };