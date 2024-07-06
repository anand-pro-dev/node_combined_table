const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    number: String,
    roll: String,
});

module.exports = mongoose.model('User', userSchema);
