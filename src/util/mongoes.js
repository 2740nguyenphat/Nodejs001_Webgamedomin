module.exports = {
	mutipleMongooseToObj: function (mongoose) {
		return mongoose.map((mongoose) => mongoose.toObject());
	},
	mongooseToObj: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    }
};