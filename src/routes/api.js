const sql = require("mssql");
var { connection } = require('../config/database')
const { NVarChar } = require('msnodesqlv8');

const getBranches = async () => {
    const pool = await connection()
    const result = await pool.request()
        .query(`SELECT [MACHINHANH] FROM [QLNH].[dbo].[CHINHANH]`)

    return result.recordset;
}
const calculateInvoiceWithBranch = async (startDate, endDate, sortByProfit, branchCode = null) => {
    const pool = await connection()
    const result = await pool.request()
        .input('StartDate', startDate)
        .input('EndDate', endDate)
        .input('SortByProfit', sortByProfit)
        .input('BranchCode', branchCode)
        .execute('calculateInvoiceWithBranch');

    console.log(result.recordset);

    return result.recordset;
}

const calculateBranchRevenueWithDetails = async (startDate, endDate, sortByProfit, minRevenue = 0, minInvoices = 0) => {
    const pool = await connection()
    const result = await pool.request()
        .input('StartDate', startDate)
        .input('EndDate', endDate)
        .input('SortByProfit', sortByProfit)
        .input('MinRevenue', minRevenue)
        .input('MinInvoices', minInvoices)
        .execute('calculateBranchRevenueWithDetails');

    console.log(result.recordset);

    return result.recordset;
}
const deleteHoaDonWithDetails = async (MAHOADON) => {
    const pool = await connection()
    const data = await pool.request()
        .input('MAHOADON', sql.NVarChar(4), MAHOADON)
        .execute('DeleteHoaDonWithDetails')

    return data;
};
const updateInvoiceWithErrors = async (MAHOADON, MANV, TENNHANVIEN) => {
    const pool = await connection()
    const data = await pool.request()
        .input('MAHOADON', sql.NVarChar(4), MAHOADON)
        .input('MANV', sql.NVarChar(3), MANV)
        .input('TENNHANVIEN', sql.NVarChar(255), TENNHANVIEN)
        .execute('UpdateInvoiceWithErrors')

    return data;
};
const updateInvoiceAndOrderDetails = async (MAHOADON, TEN, SDT) => {
    const pool = await connection()
    const data = await pool.request()
        .input('MAHOADON', sql.NVarChar(4), MAHOADON)
        .input('TEN', sql.NVarChar(255), TEN)
        .input('SDT', sql.NVarChar(10), SDT)
        .execute('UpdateInvoiceAndOrderDetails')

    return data;
};
module.exports = {
    calculateInvoiceWithBranch,
    getBranches,
    calculateBranchRevenueWithDetails,
    deleteHoaDonWithDetails,
    updateInvoiceWithErrors,
    updateInvoiceAndOrderDetails,
}
