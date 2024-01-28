const Course = require('../models/courses');
const {mutipleMongooseToObj} = require('../../util/mongoes');
class SiteControllers {
	//[GET] /
	index(req, res, next) {
		Course.find({})
			.then((course) => {				
				res.render('home', {
					course: mutipleMongooseToObj(course)
				});
			})
			.catch(next);
		// res.render('home');
	}
	//[GET] /search
	search(req, res) {
		res.render('search');
	}
}

module.exports = new SiteControllers();
