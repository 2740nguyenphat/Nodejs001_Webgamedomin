const mongoose = require('mongoose');
async function connect() {
	try {
		await mongoose.connect(process.env.MONGO_URL);
		console.log('Connected successfully!');
	} catch (error) {
		console.log('Error connecting');
		process.exit(1);
	}
}
module.exports = { connect };
