const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const multer = require('multer');
const sharp = require('sharp');

const { sendWelcomeMail, sendFarewellMail } = require('../emails/account');


const user = express.Router();

user.post('/users', async ( req, res ) => {
    const user = new User( req.body );
    const { email, name } = req.body;

    try {
        await user.save();
        sendWelcomeMail( email, name )
        const token = await user.generateAuthToken();
        
        res.status(201).send(user);
    } catch( e ) {
        res.status(400).send( e )
    }

})

user.post('/users/login', async ( req, res ) => {
   const { email, password } = req.body;
   try { 
       const user = await User.findByCredentials( email, password );
       const token = await user.generateAuthToken();
       res.send({user, token});
   } catch( e ) {
       res.status(400).send(e)
   } 
})

user.post('/users/logout', auth, async ( req, res ) => {
    try {
        req.user.tokens = req.user.tokens.filter( token => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send('Logout successfully');
    } catch( e ) {
        res.status(500).send()
    }
})

user.post('/users/logoutall', auth, async ( req, res ) => {
    try {
        req.user.tokens = [];
        console.log(req.user);
        await req.user.save();
        res.send('Logout successfully');
    } catch( e ) {
        res.status(500).send();
    }
})

// First route => middleware => route handler
user.get( '/user/me', auth, async (req, res) => {
    res.send(req.user);
})

user.get( '/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById( _id );
        if ( !user ) return res.status(404).send();
        res.status(200).send( user );
    } catch(e) {
        res.status(400).send();
    }
})

user.patch( '/users/me', auth, async (req,res) => {

    const updates = Object.keys( req.body );
    const allowUpdates = ['name', 'email', 'password', 'age'];

    console.log( req );

    const isValidUpdate = updates.every( update => allowUpdates.includes( update ) );

    if (!isValidUpdate) {
        res.status(400).send({ error: 'Invalid update!'});
    }

    try {
        // Active middlware
        updates.forEach( update => req.user[update] = req.body[update]);
        await user.save();
        // This way doesn't not active middleware when update item 
        //*const user = await User.findByIdAndUpdate(_id, req.body);*
        res.send(req.user);
        
    } catch( e ) {
      res.status(400).send( e );      
    }
})

user.delete('/users/me', auth, async (req, res) => {
    const _id = req.body.id;

    try {
        await req.user.remove();
        const { email, name } = req.user;
        sendFarewellMail( email, name );
        res.send(req.user);
    } catch(e) {
        res.status(400).send(e);
    }
})

const upload = multer({
    // dest: 'avatars', 
    limits: {
        fileSize: 1000000
    },
    fileFilter( req, file, callback ) {
        if ( !file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback( new Error('Please upload correct image file'))
        }
        callback( undefined, true );
    }
});

// The function next to route handler is used for handling error from upload file

user.post('/users/me/avatar', auth, upload.single('avatar'), async ( req, res ) => {
    const buffer = await sharp( req.file.buffer ).resize({ width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send(); 
}, ( error, req, res, next ) => {
    res.status(400).send({ error: error.message });
})

user.delete('/users/me/avatar', auth, async( req, res ) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

// Serving up avatar to user to render 
user.get('/users/:id/avatar', async( req, res ) => {
    const user = await User.findById( req.params.id );

    res.set('Content-Type', 'image/jpg');
    res.send( user.avatar );
})

module.exports = user;