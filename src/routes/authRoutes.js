const express = require('express');
const router = express.Router();
const { signup, login, verifyEmail, verifyOTP, updatePassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/sent-otp', verifyEmail);
router.post('/verify-otp', verifyOTP);
router.post('/update-password', updatePassword);
module.exports = router;
