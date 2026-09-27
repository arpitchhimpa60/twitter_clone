const express = require('express');

const router = express.Router();

const {
    getUsersToFollow,
    followUser
} = require('../controllers/follow');


router.get('/', getUsersToFollow);

router.post('/:userId', followUser);


module.exports = router;