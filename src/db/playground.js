require('./mongooes');
const User = require('../models/user');
const Task = require('../models/task');

// User.findByIdAndUpdate('5e883ec546f77517d18637f5', { age: 123 }).then( user => {
//     console.log(user);
//     return User.countDocuments({age: 25})
// } ).then( total => {
//     console.log(total)
// }).catch( e => console.log(e));

// Task.findByIdAndDelete('5e8844a760d4e41824e64f3d').then( (task) => {
//     console.log(task)
//     return Task.countDocuments({completed: false})
// }).then( result => {
//     console.log(result);
// }).catch( error => {
//     console.log(error);
// })

const findAndUpdate = async ( id, age ) => {
    const user = await User.findByIdAndUpdate( id, {age} );
    const count = await User.countDocuments( age )
    return count;
}

findAndUpdate( '5e8844a760d4e41824e64f3d', 123 ).then( result => {
    console.log(result)
}).catch( e => {
    console.log(e)
})