const express = require('express');
const { UserRegistration, UserLogin } = require('../Controllers/UserController');

const router = express.Router();

router.post('/register', UserRegistration);
router.post('/login', UserLogin); // New login route

module.exports = router;