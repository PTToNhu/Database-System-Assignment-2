const { NVarChar } = require('msnodesqlv8');
var { connection } = require('../config/database')
const getDishes = async () => {
    const pool = await connection();
    const data = await pool.request().query(`SELECT * FROM [QLNH].[dbo].[MONAN]`)
    return data
}
const getOrders = async () => {
    const pool = await connection();
    const data = await pool.request().query(
        `select *
        from [dbo].[DONHANG]
        where MADON not in (select MADONHANG from hoadon)`)
    return data
}

const getBranches = async () => {
    const pool = await connection();
    const data = await pool.request().query(
        `select * from CHINHANH`)
    return data
}
const getOrdersByPhoneNumber = async (sdt) => {
    const pool = await connection();
    const data = await pool.request()
        .input('SDT', NVarChar, sdt)
        .query(
            `select * from donhang where SDT=@sdt`
        )
    return data
}
const getInvoiceCost = async (invoiceid) => {
    const pool = await connection()
    const data = await pool.request()
        .input('InvoiceID', sql.NVarChar(4), invoiceid)
        .query(`SELECT * FROM dbo.CALCULATE_INVOICE1(@invoiceid)`)
    return data
}
module.exports = {
    getDishes, getOrders, getBranches, getOrdersByPhoneNumber, getInvoiceCost
}