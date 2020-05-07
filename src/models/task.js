const mongooes = require('mongoose');   

const taskSchema = mongooes.Schema({
    title: {
        type: String,
        trim: true,
        require: true
    },
    completed: {
        type: Boolean,
        default: false,
        // validate: ( value ) => {
        //     if ( value === true ) throw new Error('New task can be set as true at the begining');
        // }
    },
    owner: {
        type: mongooes.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
}, {
    timestamps: true
}
)

const Task = mongooes.model('Task', taskSchema);

// taskSchema.pre('save', async function( next) {
//     console.log('Before saving');
//     const task = this;

//     if(task.isModified('title')) {
//         console.log('Working');
//     } 

//     next();
// })

// const Task = mongooes.model('Tasks', taskSchema);

module.exports = Task;