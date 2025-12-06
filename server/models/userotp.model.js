const mongoose = require('mongoose');

const userOtpSchema = new mongoose.Schema({
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: { expires: 600 } },
});

module.exports = mongoose.model('UserOTP', userOtpSchema);
