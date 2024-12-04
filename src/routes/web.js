const express = require('express');
const {getHomepage, orderPage, postPaymentPage, getPaymentPage}=require('../controller/homeController');
const router = express.Router();
router.get('/', orderPage)
router.get('/order',orderPage)
router.get('/order/payment/:orderid', getPaymentPage)
router.post('/order/payment/:orderid', postPaymentPage)
module.exports = router;