const express = require('express');
const router = express.Router();
const Pusher = require('pusher');
const mongoose = require('mongoose');

const Vote = require('../models/Vote')

var pusher = new Pusher({
    appId: '538089',
    key: '3d9b731c28b5dc4e412c',
    secret: '19c1caa88909fea8af8b',
    cluster: 'us2',
    encrypted: true
});

router.get('/', (req, res) => {
    Vote.find().then(votes => {
        res.json({success: true, votes:votes})
    })
});

router.post('/', (req, res) => {
    const newVote = {
        os: req.body.os,
        points: 1
    }
    new Vote(newVote).save().then(vote => {
        pusher.trigger('os-poll', 'os-vote', {
            points: parseInt(vote.points),
            os: vote.os
        });
    });

    return res.json({success: true, message: "Thank You For Your Time"});
});

module.exports = router;