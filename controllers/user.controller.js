const User = require('../models/user.model');
const Director = require('../models/director.model');
const Serie = require('../models/serie.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {

    // requests to create a new user that is registering
    let newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 10);

    // let err = newUser.validateSync();
    
    // if (err) {
    //     console.log(err);
    //     return res.status(500).json(err);
    // }

    // Saves the new user that is registered
    newUser.save()
    .then(user => {
        user.password = undefined;
        return res.status(201).json({data: user});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).json({msg: err});
    });

    // newUser.save((err, user) => {
    //     if(err) {
    //         return res.status(400).json({msg: err});
    //     }
    //     else {
    //         user.password = undefined;
    //         return res.status(201).json({data: user});
    //     }
    // });
};

// Logs in the existing registered user
const login = (req, res) => {
    User.findOne({ email: req.body.email }) // Searches for an existing user email
    .then(user => {
        // check if password match
        if(!user || !user.comparePassword(req.body.password)) { // Compares the matching password to validate the user
            return res.status(401).json({ msg: 'Authentication failed. Invalid user or password' });
        }

        // generates the jwt token when the user logs in
        let token = jwt.sign({
            email: user.email,
            full_name: user.full_name,
            _id: user._id
        }, process.env.JWT_SECRET);

        return res.status(200).json({token});
    })
    .catch(err => {
        console.log(err);
        return res.status(400).json({msg: err});
    });
};

// Authencates the logged in user
const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        return res.status(401).json({msg: 'Unauthorized User!'}); // returns the message if the user is not logged in
    }
}

const profile = (req, res) => {
    
};

// const readOne = (req, res) => {

// };

// const readData = (req, res) => {

// };

module.exports = {
    register,
    login,
    profile,
    loginRequired
};