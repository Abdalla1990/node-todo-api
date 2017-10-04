const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');


    // db.collection('Todos').findOneAndUpdate({ text: 'eat lunch' }, {


    //         // this operator allows us to change only the specified field 
    //         // if we dont use it the document will be overwritten with only the specified values displayed. 
    //         $set: { text: 'eat dinner', completed: true }
    //     }, { returnOriginal: false })
    //     .then((result) => {

    //         console.log(JSON.stringify(result, undefined, 2));
    //     });

    db.collection('Users').findOneAndUpdate({ _id: new ObjectID('59d547d05dc8090650229bc0') }, { $set: { name: 'saeed' }, $inc: { age: 1 } }, { returnOriginal: false })
        .then((result) => {

            console.log(JSON.stringify(result, undefined, 2));
        });

    // db.close();
});