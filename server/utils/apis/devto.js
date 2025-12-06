const axios = require('axios');
require('dotenv').config();

const devto = axios.create({
    baseURL: 'https://dev.to/api/',
    headers: {
        'api-key': process.env.DEVTO_API_KEY,
        Accept: 'application/json',
    },
    timeout: 10_000,
});

module.exports = devto;
