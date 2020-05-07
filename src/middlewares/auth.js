const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Get the authetication token from header of request 
// Verify that token with our code ( sign );
// Find the user that match 

const auth = async ( req, res, next ) =>  {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token, process.env.JWT_TOKEN );
        const user = await User.findOne({ _id: decode._id, 'tokens.token': token });

        if ( !user ) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch( e ) {
        res.status(401).send({ error: 'Please authenticate' })
    }
} 

module.exports = auth;

// Without middleware: new request => run route handler
// With middleware: new request => do something => run route handler
