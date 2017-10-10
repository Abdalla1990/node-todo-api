const jwt = require('jsonwebtoken');
var data = { if: 10 }
var token = jwt.sign(data, 'secret');
console.log(token);
var decode = jwt.verify(token, 'secret');
console.log(decode);