const express = require('express');
const {getHomepage, 
        orderPage, 
        postPaymentPage, 
        getPaymentPage, 
        getInvoicepage, 
        postInvoicepage, 
        getRevenuepage, 
        postRevenuepage, 
        getCustomers, 
        postCustomer, 
        updateCustomer,
        deleteCustomer,
        deleteInvoice, 
        updateEmployee, 
        updateCustomerT
    }=require('../controller/homeController');
const router = express.Router();
router.get('/', getHomepage)
router.get('/invoice', getInvoicepage)
router.post('/invoice', postInvoicepage)
router.get('/revenue', getRevenuepage)
router.post('/revenue', postRevenuepage)
router.get('/order',orderPage)
router.get('/order/payment/:orderid', getPaymentPage)
router.post('/order/payment/:orderid', postPaymentPage)
router.get('/customer', getCustomers)
router.post('/customer', postCustomer)
router.post('/customer/update/:SDT', updateCustomer)
router.post('/customer/delete/:SDT', deleteCustomer)
router.delete('/api/deleteInvoice/:invoiceId', deleteInvoice)
router.put('/api/updateEmployee', updateEmployee)
router.put('/api/updateCustomer', updateCustomerT)
module.exports = router;