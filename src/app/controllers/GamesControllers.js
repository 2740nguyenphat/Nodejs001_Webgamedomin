const Games = require('../models/games');
const { mutipleMongooseToObj } = require('../../util/mongoes');
const uuid = require('uuid');
class GamesControllers {
	newbies(req, res) {
		res.render('games/newbies');
	}
	normal(req, res) {
		res.render('games/normal');
	}
	challenge(req, res) {
		res.render('games/challenge');
	}
	demon(req, res) {
		res.render('games/demon');
	}
	async store_achievement(req, res) {
		const { timePlay, score, title } = req.body;
		let uname;
		let role;
		if (req.session.user && req.session.user.taikhoan) {
			uname = req.session.user.taikhoan.uname;
			role = 'user';
		} else {
			uname = 'guest-' + uuid.v4(); // Tạo một ID duy nhất cho mỗi phiên 'guest'
			role = 'guest';
		}
		const newThanhtich = { timePlay: timePlay, score: score, title: title };
		try {
			await Games.findOneAndUpdate(
				{ 'taikhoan.uname': uname },
				{
					$push: { thanhtich: newThanhtich },
					$set: { 'taikhoan.role': role },
				},
				{ new: true, upsert: true, useFindAndModify: false }
			);
			res.redirect('/');
		} catch (error) {
			console.log('err', error);
		}
	}
}
module.exports = new GamesControllers();
