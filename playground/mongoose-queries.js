const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose.js');
const { Todo } = require('./../server/modules/todos');
const { User } = require('./../server/modules/users');
var id = '59d6af31b41c077d2961e625';

//===== getting todo Object =======================

//obj here is a promise on itself. the the following call , the callback assigns the obj todo to Obj.
// var obj = Todo.findById(id).then((todo) => {
//     if (!ObjectID.isValid(id)) {
//         return console.log('your id is invalid');
//     }
//     return todo;

// }).catch((err) => { console.log(err); });
// //calling the values in Obj has to be by a promise callback. 
// obj.then((todo) => {
//     if (!ObjectID.isValid(todo._id)) { return console.log('invalid ID'); }
//     console.log(todo);
// });

// ========= getting a user Object ======================


var UserObject = User.findById('69d56f4f4fbeed6d121d80c9').then((userObj) => {

    if (!userObj) return console.log('unable to find user!');

    return userObj;

});

UserObject.then((UserObj) => {

    if (!UserObj) return console.log('unable to find user!');
    return console.log(` the user info is as follows : \n  
    \n====================================
    \nUser Id :${UserObj._id}
    \nUser Email : ${UserObj.email}
    \nuser password : ${UserObj.password}
    \n====================================`);
});