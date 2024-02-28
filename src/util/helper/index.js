const Handlebars = require('handlebars');
function helpers() {
	Handlebars.registerHelper('eq', function (a, b) {
		return a === b;
	});
	Handlebars.registerHelper('maxScore', function (scores) {
		if (Array.isArray(scores)) {
			let maxScore = Math.max.apply(
				null,
				scores.map((score) => {
					// console.log('score.thanhtich:', score.score); // In ra giá trị score.thanhtich
					return Number(score.score);
				})
			);
			// console.log('Max Score:', maxScore);
			return maxScore;
		} else {
			return 'N/A'; // or whatever you want to return when scores is not an array
		}
	});
	Handlebars.registerHelper('sum', function (...args) {
		// Loại bỏ đối số cuối cùng (đối tượng options của Handlebars)
		args.pop();
		// Tính tổng các đối số còn lại
		return args.reduce((a, b) => a + b, 0);
	});
	Handlebars.registerHelper('minus', function (a, b) {
		return a - b;
	});
	Handlebars.registerHelper('plus', function (a, b) {
		return a + b;
	});
	Handlebars.registerHelper('mult', function (a, b) {
		return a * b;
	});
	Handlebars.registerHelper('lt', function (a, b) {
		return a < b;
	});
	Handlebars.registerHelper('if_eq', function (a, b, opts) {
		if (a == b) {
			return opts.fn(this);
		} else {
			return opts.inverse(this);
		}
	});
}
module.exports = { helpers };
