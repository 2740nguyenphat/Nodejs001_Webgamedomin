const mongoose = require('mongoose');
async function connect() {
	try {
		await mongoose.connect('mongodb+srv://24nguyenphat00:27072004phatZ@cluster0.7pcqw0h.mongodb.net/db_domin_dev');
		console.log('Connected successfully!');
	} catch (error) {
		console.log('Error connecting');
	}
}
module.exports = { connect };
