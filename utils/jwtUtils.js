const jwt = require('jsonwebtoken');

const secretKey = 'qiwi';

function generateToken(payload) {
    return jwt.sign(payload, secretKey, {expiresIn: '1h'});
}

module.exports = { generateToken };