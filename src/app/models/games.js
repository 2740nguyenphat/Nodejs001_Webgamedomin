const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Games = new Schema(
	{
		taikhoan: {
			uName: String,
			uPass: String,
		},
		thanhtich: [
			{
				_id: false,
				timePlay: String,
				timeCreat: { type: Date, default: Date.now },
				score: Number
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Games', Games);
