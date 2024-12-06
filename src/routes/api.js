const sql = require("mssql");
var { connection } = require('../config/database')
const { NVarChar } = require('msnodesqlv8');
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
const insertInvoiceWithDetails = async (MAHOADON, THOIGIAN, MADONHANG, MANV, SDT) => {
    const pool = await connection();
    const data = await pool.request()
        .input('MAHOADON', sql.NVarChar(4), MAHOADON)
        .input('THOIGIAN', sql.DateTime, THOIGIAN)
        .input('MADONHANG', sql.NVarChar(3), MADONHANG)
        .input('MANV', sql.NVarChar(3), MANV)
        .input('SDT', sql.NVarChar(10), SDT)
        .execute('InsertHoaDonWithDetails');
    return data;
};
const getBranches = async () => {
    const pool = await connection()
    const result = await pool.request()
        .query(`SELECT [MACHINHANH] FROM [QLNH].[dbo].[CHINHANH]`)

    return result.recordset;
}
const calculateInvoiceWithBranch = async (startDate, endDate, branchCode = null) => {
    const pool = await connection()
    const result = await pool.request()
        .input('StartDate', startDate)
        .input('EndDate', endDate)
        .input('BranchCode', branchCode)
        .execute('calculateInvoiceWithBranch');

    console.log(result.recordset);

    return result.recordset;
}

const calculateBranchRevenueWithDetails = async (startDate, endDate, minRevenue = 0, minInvoices = 0) => {
    const pool = await connection()
    const result = await pool.request()
        .input('StartDate', startDate)
        .input('EndDate', endDate)
        .input('MinRevenue', minRevenue)
        .input('MinInvoices', minInvoices)
        .execute('calculateBranchRevenueWithDetails');

    console.log(result.recordset);

    return result.recordset;
}


module.exports = {
    calculateInvoiceWithBranch,
    getBranches,
    calculateBranchRevenueWithDetails,
    getDishes,
    getOrders,
    getBranches,
    getOrdersByPhoneNumber,
    getInvoiceCost,
    insertInvoiceWithDetails
}
