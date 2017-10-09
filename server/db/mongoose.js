const config = require('./../config/config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
if (config.env == 'development') { mongoose.connect('mongodb://localhost:27017/Todos'); } else if (config.env == 'development') {
    mongoose.connect('mongodb://localhost:27017/Todos');
} else { mongoose.connect(process.env.MONGODB_URI) }

module.exports = { mongoose };