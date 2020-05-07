const express = require('express');
const multer = require('multer');

// Connect to DB
require('./db/mongooes');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');


const app = express();
const port = process.env.PORT 

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter( req, file, callback ) {
        if( !file.originalname.endsWith('.pdf')) {
            return callback( new Error('Please upload PDF'))
        }
        callback( undefined, true );
    }
});

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
})

app.listen( port, () => {
    console.log(`Server is up on port ${ port }`)
})

// const main = async () => {
//     const task = await Task.findById('5ea507872fdaf9b1019502c9');
//     await task.populate('owner').execPopulate();

//     const user = await User.findById('5ea5077a2fdaf9b1019502c6');
//     await user.populate('task').execPopulate();
//     console.log(user.tasks);
// }

// main();