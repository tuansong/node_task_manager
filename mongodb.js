//CRUD create read update delete

const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID();
// console.log(id.getTimestamp());

MongoClient.connect( connectionURL, { useNewUrlParser: true }, ( error, client ) => {
    if ( error ) {
        return console.log('Something went wrong, can not connect to mongoDB');
    }
    // console.log('Connected correctly');
    
    const db = client.db(databaseName);
    
    // Add document on collection to mongoDB

    // db.collection('tasks').insertMany(
    //     [
    //         {
    //             title: 'wake up',
    //             completed: true
    //         },
    //         {
    //             title: 'learn nodeJS',
    //             completed: false
    //         },
    //         {
    //             title: 'Become fullstack',
    //             completed: false
    //         }
    //     ],
    //     ( error, result ) => {
    //         if ( error ) { return console.log('Cannot add collection')}
    //         console.log(result.ops);
    //     } 
    // )
    // db.collection('users').findOne({ name: 'Song'}, (error, user) => {
    //     console.log(user);
    // })

    // Read collection by their properties or id 

    // db.collection('tasks').findOne({ _id: new ObjectID("5e86b32723c2ae123b06d814")}, (error, task) => {
    //     console.log(task)
    // })

    // db.collection('tasks').find({ completed: false }).count( (error, tasks) => {
    //     console.log(tasks);
    // })

    // Update collection by their properties or id 

    // db.collection('users').updateOne({ _id: new ObjectID("5e86b1aa38d85012360c9838")}, {
    //     $set: {
    //         name: 'Songuku'
    //     }
    // }).then( result => {
    //     console.log( result )
    // }).catch( error => {
    //     console.log( error )
    // } );

    // db.collection('tasks').updateMany({ completed: false }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then( res => {
    //     console.log(res)
    // }).catch( error => {
    //     console.log(error)
    // } )

    db.collection('users').deleteMany({ age: 25 })
    .then( res => {
        console.log(res)
    })
    .catch( error => {
        console.log(error)
    })
})