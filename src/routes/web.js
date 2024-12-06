const express = require('express');
const {getHomepage, orderPage, postPaymentPage, getPaymentPage, getInvoicepage, postInvoicepage, getRevenuepage, postRevenuepage}=require('../controller/homeController');
const router = express.Router();
router.get('/', getHomepage)
router.get('/invoice', getInvoicepage)
router.post('/invoice', postInvoicepage)
router.get('/revenue', getRevenuepage)
router.post('/revenue', postRevenuepage)
router.get('/order',orderPage)
router.get('/order/payment/:orderid', getPaymentPage)
router.post('/order/payment/:orderid', postPaymentPage)
module.exports = router;