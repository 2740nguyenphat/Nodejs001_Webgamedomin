const mongoose = require('mongoose');
async function connect() {
	try {
		await mongoose.connect('mongodb://localhost:27017/db_domin_dev');
		console.log('Connected successfully!');
	} catch (error) {
		console.log('Error connecting');
	}
}
module.exports = { connect };
