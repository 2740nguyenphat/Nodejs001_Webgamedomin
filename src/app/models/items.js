const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Items = new Schema({
	fileImage: { type: String, required: true },
	name: { type: String, required: true },
	info: { type: String, required: true },
	type: { type: String, required: true },
	effectChange: { type: String, required: true },
	value: { type: String, required: true },
	sender: String,
	timestamp: Date,
});

module.exports = mongoose.model('Items', Items);
