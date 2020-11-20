const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({
        email: req.body.email
    });

    if (candidate) {
        // Checking password. User find
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
        if (passwordResult) {
            // Token generation, password compared
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, { expiresIn: 3600 });
            res.status(200).json({
                token: `Bearer ${token}`
            });
        } else {
            // Password wrong. Error
            res.status(401).json({
                message: 'Password wrong. Please, try again!'
            });
        }
    } else {
        // User not find. Error
        res.status(404).json({
            message: 'User not found!'
        });
    }
}

module.exports.register = async function (req, res) {
    // email password
    const candidate = await User.findOne({
        email: req.body.email
    });

    if (candidate) {
        // User exists. Need to return an error
        res.status(409).json({
            message: 'Email exists. Change email, please!'
        });
    } else {
        // Need to create a new user
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        });

        try {
            await user.save();
            res.status(201).json(user);
        } catch(e) {
            errorHandler(res, e);
        }
    }
}