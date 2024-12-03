const express = require('express');
const {getHomepage, orderPage, postPaymentPage}=require('../controller/homeController');
const router = express.Router();
router.get('/', getHomepage)
router.get('/order',orderPage)
router.post('/order/payment/:orderid', postPaymentPage)
module.exports = router;