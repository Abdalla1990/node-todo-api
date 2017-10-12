const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
var data = { if: 10 }
var token = jwt.sign(data, 'secret');
console.log(token);
var decode = jwt.verify(token, 'secret');
console.log(decode);



var password = 'abc123';

bcryptjs.genSalt(20, (err, salt) => {
    bcryptjs.hash(password, salt, (err, hash) => {

        console.log(hash);
    });
});