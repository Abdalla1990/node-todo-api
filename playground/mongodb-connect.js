const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Users').insertOne({
        name: 'Andrew',
        age: 25,
        location: 'Philadelphia'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert user', err);
        }

        console.log(result.ops);
    });

    db.collection('Users').find({ name: 'abdalla ahmed' }).toArray().then((docs) => {

        console.log(JSON.stringify(docs, undefined, 2));
    });

    db.close();
});