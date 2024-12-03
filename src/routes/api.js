var { connection } = require('../config/database')
const sql = require("mssql");

const CalculateInvoiceWithBranch = async function callCalculateInvoiceWithBranch(startDate, endDate, branchCode = null) {
      // Kết nối tới SQL Server
      const pool = await sql.connect(config);
  
      // Tạo request và gọi thủ tục
      const result = await pool.request()
        .input('StartDate', sql.DateTime, startDate)     
        .input('EndDate', sql.DateTime, endDate)         
        .input('BranchCode', sql.NVarChar(10), branchCode)
        .execute('CalculateInvoiceWithBranch');   
  }

module.exports={CalculateInvoiceWithBranch}