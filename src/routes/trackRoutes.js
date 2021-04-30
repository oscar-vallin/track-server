const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

router.use(requireAuth);

router.get('/', async (req,res) => {
    const track = await Track.find({userId: req.user._id});

    res.send(track);
});

router.post('/', async (req,res) => {
    const {name,locations} = req.body;

    if(!name || !locations){
        return res.status(422).json({msg: 'you must provide a name and locations'});
    };

    try {
        const track = new Track({name, locations, userId: req.user._id});
        await track.save(),
        res.send(track);
    } catch (error) {
        console.log(error);
        res.status(422).json({error: error.message});
    };
    
});
module.exports = router;