const siteRoute = require('./site');
const gamesRoute = require('./games');
function route(app) {
	app.use('/games', gamesRoute);

	app.use('/', siteRoute);
}
module.exports = route;
