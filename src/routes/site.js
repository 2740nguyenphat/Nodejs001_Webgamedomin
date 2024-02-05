const express = require('express');
const router = express.Router();

const siteControllers = require('../app/controllers/SiteControllers');

router.get('/search', siteControllers.search);
router.get('/rank', siteControllers.rank);
router.get('/', siteControllers.index);

module.exports = router;
