const path = require('path');
const express = require('express');
var morgan = require('morgan');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config/db');

global.userID = '';

//helper hbs
// Handlebars.registerHelper('eq', function (a, b, options) {
// 	if (a === b) {
// 		return options.fn(this);
// 	} else if (typeof options.inverse === 'function') {
// 		return options.inverse(this);
// 	}
// });
Handlebars.registerHelper('eq', function (a, b) {
	return a === b;
});

// Handlebars.registerHelper('maxScore', function (scores) {
// 	return Math.max.apply(
// 		null,
// 		scores?.map((score) => Number(score.thanhtich))
// 	);
// });
Handlebars.registerHelper('maxScore', function (scores) {
	if (Array.isArray(scores)) {
		let maxScore = Math.max.apply(
			null,
			scores.map((score) => {
				console.log('score.thanhtich:', score.score); // In ra giá trị score.thanhtich
				return Number(score.score);
			})
		);
		console.log('Max Score:', maxScore);
		return maxScore;
	} else {
		return 'N/A'; // or whatever you want to return when scores is not an array
	}
});

db.connect();

app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined'));

app.engine(
	'hbs',
	engine({
		extname: 'hbs',
	})
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

//route init
route(app);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
