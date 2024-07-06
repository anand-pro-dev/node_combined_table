const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    salary: Number,
    exp: Number,
    address: String,
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);
