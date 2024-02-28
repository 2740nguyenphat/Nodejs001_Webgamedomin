const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Games = new Schema(
	{
		taikhoan: {
			uname: { type: String, required: true, unique: true },
			upass: { type: String, required: true },
			role: { type: String, default: 'user' },
			nickname: { type: String, required: true, unique: true },
			email: String,
		},
		thanhtich: [
			{
				_id: false,
				timePlay: String,
				title: String,
				timeCreat: { type: Date, default: Date.now },
				score: Number,
			},
		],
		userStorage: [
			{
				_id: false,
				name: { type: String, required: true },
				isUsed: { type: String},
				timeCreat: { type: Date, default: Date.now },
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Games', Games);
