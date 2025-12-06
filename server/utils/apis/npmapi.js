const axios = require('axios');
require('dotenv').config();

const npm = axios.create({
    baseURL: 'https://registry.npmjs.org/', 
    headers: {
        Authorization: `Bearer ${process.env.NPM_API_KEY}`, 
    },
    timeout: 10_000,
});

module.exports = npm;
