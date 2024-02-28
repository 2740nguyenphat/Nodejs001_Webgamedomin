const path = require('path');
const express = require('express');
var morgan = require('morgan');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const app = express();
const port = 3000;

// Khởi tạo server HTTP sử dụng Express
const server = require('http').createServer(app);
const Message = require('./app/models/messages');
const Games = require('./app/models/games');
const Items = require('./app/models/items');

// Khởi tạo instance của Socket.IO
const io = require('socket.io')(server);

// Server
io.on('connection', async (socket) => {
	console.log('Một user đã kết nối');
	const messages = await Message.find().sort({ timestamp: 1 });
	socket.emit('chat history', messages);

	socket.on('chat message', async (msg, sender) => {
		sender = sender || 'guest';
		let color = 'black';
		if (sender !== 'guest') {
			const user = await Games.findOne({
				'taikhoan.uname': sender,
			}).lean();
			if (user) {
				if (user.userStorage) {
					for (let item of user.userStorage) {
						if (item.isUsed === 'true') {
							const matchedItem = await Items.findOne({
								name: item.name,
							}).lean();
							if (
								matchedItem &&
								matchedItem.effectChange === 'color'
							) {
								color = matchedItem.value;
								break;
							}
						}
					}
				}
				sender = user.taikhoan.nickname;
			} else {
				sender = 'guest'; // Replace the sender with 'guest' if the user is not logged in
			}
		}
		const message = new Message({
			message: msg,
			sender: sender, // Store the sender in the message
			timestamp: new Date(),
			color: color, // Store the color in the message
		});
		try {
			await message.save();
			io.emit('chat message', {
				type: 'user',
				text: msg,
				sender: sender, // Send the sender to the clients
				color: color, // Send the color to the clients
			});
		} catch (err) {
			console.error(err);
		}
	});

	socket.on('disconnect', () => {
		console.log('Một user đã ngắt kết nối');
	});
});

const route = require('./routes');

//db
const db = require('./config/db');
db.connect();
//hepler
const helper = require('./util/helper');
helper.helpers();
//session
app.use(bodyParser.urlencoded({ extended: false }));

const store = new MongoDBStore({
	uri: 'mongodb://localhost:27017/db_domin_dev',
	collection: 'sessions',
});

app.use(
	session({
		secret: 'some secret',
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use((req, res, next) => {
	res.locals.user = req.session.user;
	next();
});

//GridFS

app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined'));
app.use(methodOverride('_method'));

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
app.use(function (req, res, next) {
	res.status(404).render('err_404');
});

server.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
