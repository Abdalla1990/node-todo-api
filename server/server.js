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


app.post('/todos', authenticate, (req, res) => {

    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.status(200).send(doc);
        console.log(JSON.stringify(doc));
    }, (err) => {

        res.status(400).send(err);
    });




});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
            _creator: req.user._id
        })
        .then((todosList) => { res.send(JSON.stringify({ todosList })) }, (err) => { res.status(400).send(JSON.stringify(err)) })
});
app.get('/todos/:id', authenticate, (req, res) => {

    var id = req.params.id
    if (!ObjectID.isValid(id)) { return res.status(404).send(); }
    Todo.findOne({
            _id: id,
            _creator: req.user._id
        })
        .then((doc) => {
            if (!doc) { res.status(404).send(); }
            res.send({ doc })
        })
        .catch((e) => {
            res.status(404).send();
        });



});
app.delete('/todos/delete/:id', authenticate, (req, res) => {

    var id = req.params.id
    if (!ObjectID.isValid(id)) { return res.status(404).send(); }
    Todo.findOneAndRemove({ _id: id, _creator: req.user._id })
        .then((doc) => {
            if (!doc) { res.status(404).send(); }
            res.send({ doc })
        })
        .catch((e) => {
            res.status(404).send();
        });
});

app.patch('/todos/update/:id', authenticate, (req, res) => {
    var id = req.params.id;

    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) { return res.status(404).send(); }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.complete = false;
        body.completedAt = null;
    }
    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then((doc) => {
        if (!doc) { res.status(404).send(); }
        res.send({ doc });
    }).catch((err) => { res.status(404).send(); });
});

//===================== user routes ==========================//
app.post('/users/login', (req, res) => {
    console.log('inside the function');
    var body = _.pick(req.body, ['email', 'password']);
    console.log(req.body.email);
    console.log(req.body.password);


    User.findByCredentials(body.email, body.password).then((User) => {

        return User.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(User);
        });


    }).catch((err) => {
        res.status(400).send(err)
    });

});


app.post('/users/create-user', (req, res) => {
    console.log('inside the function');
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
    console.log('inside the function');
    res.send(req.user);
});

app.get('/users/:id', (req, res) => {
    console.log('inside the function');
    var id = req.params.id;
    User.findById(id).then((user) => {
        res.status(200).send(user);
    }).catch((err) => {
        res.status(400).send('there is an error ', err);
    })
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, (err) => {
        res.status(400).send();
    })
});











app.listen(port, () => {
    console.log(`started up at port :${port}`)
});


module.exports = { app };