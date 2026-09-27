const express = require('express');
const router = express.Router();
const {getAllUsers,handleUserSignUp,handleUserLgin} = require('../controllers/user')

router.get('/', getAllUsers);
router.post('/', handleUserSignUp);
router.post('/login' , handleUserLgin);

module.exports = router;