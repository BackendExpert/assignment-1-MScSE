const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config/env');

function sign(payload, expiresIn= '1d'){
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verify(token){
    return jwt.verify(token, JWT_SECRET)
}

module.exports = { sign, verify }
