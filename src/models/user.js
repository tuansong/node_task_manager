const mongooes = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const Task = require('./task');

// Define User schema

const userSchema = mongooes.Schema({
    name: {
        type: String,
        trim: true
    },
    age: {
        type: Number,
        validate: ( value ) => {
            if ( value < 0 ) {
                throw new Error('Please provide the positive number');
            }
        }
    },
    email: {
        type: String,
        trim: true,
        require: true,
        unique: true,
        lowercase: true,
        validate: ( value ) => {
            if ( !validator.isEmail(value) ) {
                throw new Error('Please provide valid email')
            }
        }
    },
    password: {
        type: String,
        minlength: 7,
        trim: true,
        validate: (value) => {
            if ( value === 'password' ) {
                throw new Error('Your password must less than 6 character');
            }
        },
    },
    tokens: [
        {
            token: {
                type: String,
                require: true
            }
        }
    ],
    avatar: {
        type: Buffer
    }   
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

// JSON.stringify always be called at response 
userSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();
    console.log(user, userObj);

    delete userObj.tokens;
    delete userObj.password;
    delete userObj.avatar;

    return userObj;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN );
    user.tokens = user.tokens.concat({ token });
    await user.save()
    return token;
}

userSchema.statics.findByCredentials = async( email, password ) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if ( !isMatch ) {
        throw new Error('Email or password is not correct!');
    }
    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function( next ) {
    const user = this;

    console.log('Just before saving!');

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    // next() helps middleware connect to db then save it and keep the app working
    next();
})

// Remove all related Tasks after remove owner 
userSchema.pre('remove', async function( next ) {
    const user = this
    await Task.deleteMany({ owner: user._id });
    next();
})

const User = mongooes.model('User', userSchema)

module.exports = User;