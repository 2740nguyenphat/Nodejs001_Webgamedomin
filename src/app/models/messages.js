const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Messages = new Schema({
	message: { type: String, required: true },
	color: { type: String, required: true },
	sender: String,
	timestamp: Date,
});

module.exports = mongoose.model('Messages', Messages);
