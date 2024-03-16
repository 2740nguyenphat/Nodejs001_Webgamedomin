const express = require('express');
const router = express.Router();

const siteControllers = require('../app/controllers/SiteControllers');
const route = require('.');

router.get('/search', siteControllers.search);
router.get('/login', siteControllers.login);
router.get('/register', siteControllers.register);
router.get('/profile', siteControllers.profile);
router.get('/shop', siteControllers.shop);
router.get('/logout', siteControllers.logout);
router.get('/rank/:title/:page?', siteControllers.rank);
router.get('/', siteControllers.index);

// router.post('/shop/get/:title', siteControllers.getItems);
router.post('/login', siteControllers.chkLogin);
router.post('/register', siteControllers.chkRegister);
router.post('/profile/updateStorage', siteControllers.updateStorage);

module.exports = router;
