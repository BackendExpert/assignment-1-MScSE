const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    totpSecret: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
