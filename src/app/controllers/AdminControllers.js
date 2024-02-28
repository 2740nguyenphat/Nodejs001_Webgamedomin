const Games = require('../models/games');
const moment = require('moment');
const { mutipleMongooseToObj } = require('../../util/mongoes');
const { mongooseToObj } = require('../../util/mongoes');

class AdminControllers {
	//[GET] /admin/account
	adminAccount(req, res, next) {
		let userr = req.session.user
			? req.session.user.taikhoan.role
			: undefined;
		if (userr === 'admin') {
			Games.find({})
				.lean()
				.then((games) => {
					games.forEach((game) => {
						let createdAt = game.createdAt;
						let date = moment(createdAt);
						game.formattedDate = date.format('DD-MM-YYYY HH:mm:ss');
					});
					//console.log(games); // in ra giá trị của games
					res.render('admin/account', {
						games: games,
					});
				})
				.catch(next);
		} else {
			res.render('err_404');
		}
	}

	//[GET] /admin/account/:role
	adminAccountByRole(req, res, next) {
		let username = req.session.user
			? req.session.user.taikhoan.role
			: undefined;
		let role = req.params.role;
		if (username === 'admin') {
			let query = role === 'all' ? {} : { 'taikhoan.role': role };
			Games.find(query)
				.lean()
				.then((games) => {
					games.forEach((game) => {
						let createdAt = game.createdAt;
						let date = moment(createdAt);
						game.formattedDate = date.format('DD-MM-YYYY HH:mm:ss');
					});
					res.json(games); // Sử dụng res.json để trả về dữ liệu JSON
				})
				.catch(next);
		} else {
			res.render('err_404');
		}
	}

	//[GET] /admin/product
	adminProduct(req, res, next) {
		let username = req.session.user
			? req.session.user.taikhoan.role
			: undefined;
		if (username === 'admin') {
			res.render('admin/product');
		} else {
			res.render('err_404');
		}
	}

	//[DELETE] /admin/:id
	destroy(req, res, next) {
		Games.deleteOne({ _id: req.params.id })
			.then(() => res.redirect('back'))
			.catch(next);
	}
}

module.exports = new AdminControllers();
