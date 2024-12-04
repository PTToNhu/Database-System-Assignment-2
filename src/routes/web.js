const express = require('express');
const { getHomepage, getInvoicepage, postInvoicepage, getRevenuepage, postRevenuepage }
    = require('../controller/homeController');
const router = express.Router();
router.get('/', getHomepage)
router.get('/invoice', getInvoicepage)
router.post('/invoice', postInvoicepage)
router.get('/revenue', getRevenuepage)
router.post('/revenue', postRevenuepage)
module.exports = router;