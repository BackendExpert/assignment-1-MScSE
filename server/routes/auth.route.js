const express = require('express');
const AuthController = require("../controllers/auth.controller")

const router = express.Router();

router.post('/register', AuthController.registation);
router.post('/verify-email', AuthController.verifyEmail);
router.post('/setup-totp', AuthController.setupTOTP);
router.post('/verify-totp-login', AuthController.verifyTOTPLogin);
router.post('/login', AuthController.login);

module.exports = router;