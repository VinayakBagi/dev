const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const weatherSchema = new Schema({
    date: Date,
    day:  Number,
    isPrime: Boolean,
    message: String
});

module.exports = mongoose.model('Weather', weatherSchema);