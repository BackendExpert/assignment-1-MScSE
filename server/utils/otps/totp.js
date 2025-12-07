const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

async function createTOTPSecret(email) {
    const secretObj = speakeasy.generateSecret({ name: `CareerAI (${email})` });
    const qrCode = await QRCode.toDataURL(secretObj.otpauth_url);
    return { secret: secretObj.base32, qrCode };
}

function verifyTOTP(secret, token) {
    return speakeasy.totp.verify({ secret, encoding: 'base32', token, window: 1 });
}

module.exports = { createTOTPSecret, verifyTOTP };
