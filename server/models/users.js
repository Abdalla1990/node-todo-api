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

UserSchema.methods.removeToken = function(token) {

    var user = this;
    return user.update({
        $pull: {
            tokens: { token }
        }
    })
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


UserSchema.statics.findByCredentials = function(email, password) {

    var User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject('user doesnt exist');
        }
        // since we cant call bcrypt without a callback function we simulated a callback 
        //function by creating a new promice which returns a callback!
        return new Promise((resolve, reject) => {

            result = bcryptjs.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject('there is an error ', err);
                }
            });
        });
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