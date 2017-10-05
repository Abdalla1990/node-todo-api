var { Mongoose } = require('./db/mongoose.js');
var { Todo } = require('./modules/todos');
var { User } = require('./modules/users');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.post('/todos', (req, res) => {

    var todo = new Todo({

        text: req.body.text,
        completed: req.body.completed
    });
    todo.save().then((doc) => {
        res.status(200).send(doc);
        console.log(JSON.stringify(doc));
    }, (err) => {

        res.status(400).send(doc);
    });




});

app.get('/todos', (req, res) => {
    Todo.find()
        .then((todosList) => { res.send(JSON.stringify({ todosList })) }, (err) => { res.status(400).send(JSON.stringify(err)) })
})


app.listen(3000, () => {
    console.log('started at 3000 .')
});


module.exports = { app };