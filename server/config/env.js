require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT || '10', 10),
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    OPENCAGE_API_KEY: process.env.OPENCAGE_API_KEY,
};
