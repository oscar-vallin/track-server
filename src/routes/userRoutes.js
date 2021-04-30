const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const requireAuth = require('../middlewares/requireAuth');

const User = mongoose.model('User');

router.post('/signup', async (req,res) => {
    console.log(req.body)
    let {email, password} = req.body;
    
    try {
        const user = new User({email, password});
        await user.save();
        const payload = {
            userId: user._id
        };
        jwt.sign(payload, 'MY_SECRET_KEY', {
            expiresIn: '1d'
        }, (error, token) => {
            if(error) throw error;

            res.send({token});
        });
    } catch (error) {
        console.log(error.message);
        res.status(422).send(error.message);
    };

});

router.post('/signin', async (req,res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(422).json({msg: 'must provide email and password'});
    };

    let user = await User.findOne({email});

    if(!user){
        return res.status(422).json({error: 'invalid password or email'});
    };

    try {
        await user.comparePassword(password);

        const payload = {
            userId: user._id
        };
        jwt.sign(payload, 'MY_SECRET_KEY', {
             expiresIn: '1d'
            },(error, token) => {
            if(error) throw error;

            res.send({token});
        });
    } catch (error) {
        res.status(422).json({error: 'invalid password or email'});
    }
    
})

router.get('/', requireAuth, async (req,res) => {
    return res.send(`your email is ${req.user.email}`);
});

module.exports = router;