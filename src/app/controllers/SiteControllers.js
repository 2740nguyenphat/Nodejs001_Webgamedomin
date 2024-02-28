const Games = require('../models/games');
const Items = require('../models/items');
const moment = require('moment');
const { mutipleMongooseToObj } = require('../../util/mongoes');
const { mongooseToObj } = require('../../util/mongoes');
class SiteControllers {
	//[GET] /
	index(req, res, next) {
		// Games.find({})
		// 	.then((games) => {
		// 		res.render('home', {
		// 			games: mutipleMongooseToObj(games),
		// 		});
		// 	})
		// 	.catch(next);
		//res.locals.user = req.session.user;
		res.render('home');
	}
	//[GET] /search
	search(req, res) {
		res.render('search');
	}

	//[GET] /rank
	rank(req, res, next) {
		let title = req.params.title;
		let page = req.params.page ? Number(req.params.page) : 1;
		let gamesPerPage = 10;
		let username = req.session.user
			? req.session.user.taikhoan.uname
			: undefined;
		Games.find({})
			.lean()
			.then((games) => {
				let filteredGames = games
					.map((game) => {
						let filteredThanhtich = game.thanhtich.filter(
							(thanhtich) => thanhtich.title === title
						);

						if (filteredThanhtich.length > 0) {
							let maxScoreThanhtich = filteredThanhtich.reduce(
								(max, current) =>
									current.score > max.score ? current : max,
								filteredThanhtich[0]
							);

							return { ...game, thanhtich: [maxScoreThanhtich] };
						}
					})
					.filter((game) => game !== undefined);

				filteredGames.sort(
					(a, b) => b.thanhtich[0]?.score - a.thanhtich[0]?.score
				);

				// Tìm thứ hạng của người dùng
				let yourRank = username ? 1 : undefined;
				for (let game of filteredGames) {
					if (game.taikhoan.uname === username) {
						break;
					}
					yourRank++;
				}
				// Phân trang
				let maxPages = Math.ceil(
					Object.keys(games).length / gamesPerPage
				);
				let start = (page - 1) * gamesPerPage;
				let end = start + gamesPerPage;
				let paginatedGames = filteredGames.slice(start, end);

				// Thêm thuộc tính rank vào mỗi game
				for (let i = 0; i < paginatedGames.length; i++) {
					paginatedGames[i].rank = start + i + 1;
				}
				//console.log(filteredGames);
				//console.log(yourRank);
				console.log(start, end);
				res.render('rank', {
					page: page,
					title: title,
					maxPages: maxPages,
					games: filteredGames,
					games: paginatedGames,
					yourRank: yourRank,
				});
			})
			.catch((error) => {
				console.log('err', error);
			});
	}

	//[GET] /login
	login(req, res) {
		res.render('login');
	}

	//[GET] /logout
	logout(req, res) {
		req.session.destroy();
		res.redirect('/');
	}

	//[GET] /register
	register(req, res) {
		res.render('register');
	}

	//[GET] /profile
	async profile(req, res) {
		const user = await Games.findOne({
			'taikhoan.uname': req.session.user.taikhoan.uname,
		}).lean();
		if (user) {
			if (user.thanhtich) {
				user.thanhtich.forEach((user) => {
					let createdAt = user.createdAt;
					let date = moment(createdAt);
					user.formattedDate = date.format('DD-MM-YYYY HH:mm:ss');
				});
			}
			if (user.userStorage) {
				user.userStorage.forEach((user) => {
					let createdAt = user.createdAt;
					let date = moment(createdAt);
					user.formattedDate = date.format('DD-MM-YYYY HH:mm:ss');
				});
			}

			res.render('profile', user);
		} else {
			res.status(404).send({ message: 'User not found' });
		}
	}

	//[GET] /shop
	async shop(req, res) {
		await Items.find({})
			.lean()
			.then((items) => {
				res.render('shop', {
					items: items
				})
			}).catch((err) => {
				console.error(err);
			});
	}

	//[POST] /login
	async chkLogin(req, res) {
		const { uname, upass } = req.body;
		const user = await Games.findOne({
			'taikhoan.uname': uname,
			'taikhoan.upass': upass,
		}).lean();
		console.log(user);
		if (user) {
			req.session.user = user;
			let role = req.session.user
				? req.session.user.taikhoan.role
				: undefined;
			console.log(role);
			// res.render('home', {
			// 	user : req.session.user,
			// });
			res.status(200).send({ message: 'User login successfully', role });
		} else {
			res.status(200).send({
				message:
					'Tên đăng nhập hoặc mật khẩu không đúng, vui lòng kiểm tra lại!',
			});
		}
		//console.log('Login thanh cong');
		//res.json(req.body);
		// res.redirect('/');
	}

	//[POST] /register
	async chkRegister(req, res) {
		console.log(req.body);
		const { nickname, uname, upass, confirm_password, email } = req.body;
		try {
			if (upass !== confirm_password) {
				throw new Error('Passwords không khớp, vui lòng kiểm tra lại');
			}

			const userWithSameUsername = await Games.findOne({
				'taikhoan.uname': uname,
			});

			if (userWithSameUsername) {
				throw new Error('Username đã tồn tại');
			}

			const userWithSameNickname = await Games.findOne({
				'taikhoan.nickname': nickname,
			});
			if (userWithSameNickname) {
				throw new Error('Nickname đã tồn tại');
			}

			const newUser = new Games({
				taikhoan: { nickname, uname, upass, email },
			});
			await newUser.save();
			res.status(200).send({ message: 'User created successfully' });
		} catch (err) {
			res.status(200).send({ message: err.message });
		}
	}

	//[POST] /profile/updateStorage
	async updateStorage(req, res, next) {
		const { uname } = req.session.user.taikhoan;
		const user = await Games.findOne({ 'taikhoan.uname': uname });
		if (user) {
			// Set all items in userStorage to not used
			user.userStorage.forEach((item) => {
				item.isUsed = 'false';
			});

			// Update the items that the user has selected to used
			for (let itemName in req.body) {
				const userItem = user.userStorage.find(
					(userItem) => userItem.name === itemName
				);
				if (userItem) {
					userItem.isUsed = 'true';
				}
			}

			await user.save();
			res.redirect('/profile');
		} else {
			res.status(404).send({ message: 'User not found' });
		}
	}
}

module.exports = new SiteControllers();
