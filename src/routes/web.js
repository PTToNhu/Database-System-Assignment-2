const express = require('express');
const { getHomepage, getInvoicepage, postInvoicepage, getRevenuepage,
    postRevenuepage, deleteInvoice, updateEmployee, updateCustomer } 
    = require('../controller/homeController');
const router = express.Router();
router.get('/', getHomepage)
router.get('/invoice', getInvoicepage)
router.post('/invoice', postInvoicepage)
router.get('/revenue', getRevenuepage)
router.post('/revenue', postRevenuepage)
router.delete('/api/deleteInvoice/:invoiceId', deleteInvoice)
router.put('/api/updateEmployee', updateEmployee)
router.put('/api/updateCustomer', updateCustomer)
module.exports = router;