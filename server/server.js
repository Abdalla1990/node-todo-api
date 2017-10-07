var { Mongoose } = require('./db/mongoose.js');
var { Todo } = require('./modules/todos');
var { User } = require('./modules/users');
var express = require('express');
var bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
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
});
app.get('/todos/:id', (req, res) => {

    var id = req.params.id
    if (!ObjectID.isValid(id)) { return res.status(404).send(); }
    Todo.findById(id)
        .then((doc) => {
            if (!doc) { res.status(404).send(); }
            res.send({ doc })
        })
        .catch((e) => {
            res.status(404).send();
        });



})


app.listen(3000, () => {
    console.log('started the server at 3000 .')
});


module.exports = { app };