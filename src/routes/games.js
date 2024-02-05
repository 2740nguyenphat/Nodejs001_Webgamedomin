const express = require('express');
const router = express.Router();

const gameControllers = require('../app/controllers/GamesControllers');

//gamesControllers.index
router.get('/newbies', gameControllers.newbies);
router.get('/normal', gameControllers.normal);
router.get('/challenge', gameControllers.challenge);
router.get('/demon', gameControllers.demon);


router.post('/store', gameControllers.store_achievement);

module.exports = router;
