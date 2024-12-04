const { NVarChar } = require('msnodesqlv8');
var { connection } = require('../config/database')

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
    calculateBranchRevenueWithDetails
}
