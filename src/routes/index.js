const siteRoute = require('./site');
const gamesRoute = require('./games');
const adminRoute = require('./admin');
function route(app) {
	app.use('/games', gamesRoute);
	app.use('/admin', adminRoute);

	app.use('/', siteRoute);
}
module.exports = route;
