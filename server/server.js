var { Mongoose } = require('./db/mongoose.js');
var { Todo } = require('./models/todos');
var { User } = require('./models/users');
var express = require('express');
var bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
var app = express();
var { authenticate } = require('./middleware/authentication');

const port = process.env.PORT || 3000;
app.use(bodyParser.json());


// =========todos routes================


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



});
app.delete('/todos/delete/:id', (req, res) => {

    var id = req.params.id
    if (!ObjectID.isValid(id)) { return res.status(404).send(); }
    Todo.findByIdAndRemove(id)
        .then((doc) => {
            if (!doc) { res.status(404).send(); }
            res.send({ doc })
        })
        .catch((e) => {
            res.status(404).send();
        });
});

app.patch('/todos/update/:id', (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) { return res.status(404).send(); }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.complete = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((doc) => {
        if (!doc) { res.status(404).send(); }
        res.send({ doc });
    }).catch((err) => { res.status(404).send(); });
});

//===================== user routes ==========================//



app.post('/users/create-user', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => { // this call back with a promise for the authentication function 
        // function defined in the User Modle 

        return user.generateAuthToken();

    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    })


});


// with authentication middleware 
app.get('/users/me', authenticate, (req, res) => {

    res.send(req.user);
});

app.post('users/login', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);
    console.log(body.email);
    User.findByCredentials(body.email, body.password).then((user) => {
        res.status(200).send(user);
    }).catch((err) => {
        res.status(400).send(err)
    });

});










app.listen(port, () => {
    console.log(`started up at port :${port}`)
});


module.exports = { app };