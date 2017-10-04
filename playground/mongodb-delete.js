const { MongoClient, ObjectID } = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');


    // db.collection('Todos').deleteMany({ completed: false }).then((result) => {

    //     console.log(JSON.stringify(result));
    // });

    db.collection('Users').findOneAndDelete({ _id: new ObjectID("59d54afb32935a0838fc60c9") }).then((result) => {

        console.log(JSON.stringify(result, undefined, 2));
    });

    db.close();
});