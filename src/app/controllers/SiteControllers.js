const Games = require('../models/games');
const { mutipleMongooseToObj } = require('../../util/mongoes');
const { mongooseToObj } = require('../../util/mongoes');
class SiteControllers {
	//[GET] /
	index(req, res, next) {
		Games.find({})
			.then((games) => {
				res.render('home', {
					games: mutipleMongooseToObj(games),
				});
			})
			.catch(next);
		// res.render('home');
	}
	//[GET] /search
	search(req, res) {
		res.render('search');
	}

	//[GET] /rank
	rank(req, res, next) {
		Games.find({})
		.lean()
			.then((games) =>
				res.render('rank', {
					games: games,
				})
			)
			.catch(next);
	}
}

module.exports = new SiteControllers();
