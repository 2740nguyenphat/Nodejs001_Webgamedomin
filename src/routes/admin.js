const express = require('express');
const router = express.Router();

const adminControllers = require('../app/controllers/AdminControllers');

router.get('/account', adminControllers.adminAccount);
router.get('/account/:role', adminControllers.adminAccountByRole);
router.get('/product', adminControllers.adminProduct);

router.delete('/:id', adminControllers.destroy);

module.exports = router;
