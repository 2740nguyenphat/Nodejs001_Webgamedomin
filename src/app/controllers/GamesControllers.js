const Games = require('../models/games');
const { mutipleMongooseToObj } = require('../../util/mongoes');
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
	store_achievement(req, res, next) {
		const { timePlay, score } = req.body;
		const id = '65b8e5c75d2c6d05778bdbcb';
		const newThanhtich = { timePlay: timePlay, score: score };
		const games = new Games();
		Games.findByIdAndUpdate(
			id,
			{ $push: { thanhtich: newThanhtich } },
			{ new: true, upsert: true, useFindAndModify: false }
		).then(() => res.redirect('/'))
		.catch((error) => {});
	}
}
module.exports = new GamesControllers();
