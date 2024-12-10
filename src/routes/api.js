const sql = require("mssql");
var { connection } = require("../config/database");
const { NVarChar } = require("msnodesqlv8");
const getDishes = async () => {
  const pool = await connection();
  const data = await pool.request().query(`SELECT * FROM [QLNH].[dbo].[MONAN]`);
  return data;
};
const getOrders = async () => {
  const pool = await connection();
  const data = await pool.request().query(
    `select *
        from [dbo].[DONHANG]
        where MADON not in (select MADONHANG from hoadon)`
  );
  return data;
};
const getOrdersByPhoneNumber = async (sdt) => {
  const pool = await connection();
  const data = await pool
    .request()
    .input("SDT", NVarChar, sdt)
    .query(`select * from donhang where SDT=@sdt`);
  return data;
};
const getInvoiceCost = async (MADONHANG, THOIGIAN, SDT) => {
  const pool = await connection();
  const data = await pool
    .request()
    .input("MADONHANG", sql.NVarChar(3), MADONHANG)
    .input("THOIGIAN", sql.DATETIME, THOIGIAN)
    .input("SDT", sql.NVarChar(10), SDT)
    .query(`SELECT * FROM dbo.CALCULATE_INVOICE2(@MADONHANG, @THOIGIAN, @SDT)`);
  return data;
};
const insertInvoiceWithDetails = async (
  MAHOADON,
  THOIGIAN,
  MADONHANG,
  MANV,
  SDT
) => {
  const pool = await connection();
  const data = await pool
    .request()
    .input("MAHOADON", sql.NVarChar(4), MAHOADON)
    .input("THOIGIAN", sql.DateTime, THOIGIAN)
    .input("MADONHANG", sql.NVarChar(3), MADONHANG)
    .input("MANV", sql.NVarChar(3), MANV)
    .input("SDT", sql.NVarChar(10), SDT)
    .execute("InsertHoaDonWithDetails");
  return data;
};
const getBranches = async () => {
  const pool = await connection();
  const result = await pool
    .request()
    .query(`SELECT [MACHINHANH] FROM [QLNH].[dbo].[CHINHANH]`);

  return result.recordset;
};
const calculateInvoiceWithBranch = async (
  startDate,
  endDate,
  sortByProfit,
  branchCode = null
) => {
  const pool = await connection();
  const result = await pool
    .request()
    .input("StartDate", startDate)
    .input("EndDate", endDate)
    .input("SortByProfit", sortByProfit)
    .input("BranchCode", branchCode)
    .execute("calculateInvoiceWithBranch");

  console.log(result.recordset);

  return result.recordset;
};

const calculateBranchRevenueWithDetails = async (
  startDate,
  endDate,
  sortByProfit,
  minRevenue = 0,
  minInvoices = 0
) => {
  const pool = await connection();
  const result = await pool
    .request()
    .input("StartDate", startDate)
    .input("EndDate", endDate)
    .input("SortByProfit", sortByProfit)
    .input("MinRevenue", minRevenue)
    .input("MinInvoices", minInvoices)
    .execute("calculateBranchRevenueWithDetails");

  console.log(result.recordset);
  return result.recordset;
};

const getCustomersFDB = async () => {
  const pool = await connection();
  const data = await pool
    .request()
    .query(`SELECT * FROM [QLNH].[dbo].[KHACHHANG]`);
  return data;
};
const postCustomerFDB = async (Name, PhoneNumber) => {
  const pool = await connection();
  try {
    const data = await pool
      .request()
      .input("SDT", sql.NVarChar(10), PhoneNumber)
      .input("TEN", sql.NVarChar(255), Name)
      .execute("sp_InsertKhachHang");
    result = { success: true, message: "Customer added successfully!", data };
  } catch (err) {
    result = {
      success: false,
      message: err.originalError?.message || "An unexpected error occurred.",
    };
  }
  return result;
};

const updateCustomerFDB = async (Name, PhoneNumber) => {
  const pool = await connection();
  try {
    const data = await pool
      .request()
      .input("SDT", sql.NVarChar(10), PhoneNumber)
      .input("TEN", sql.NVarChar(255), Name)
      .execute("sp_UpdateKhachHang");
    result = { success: true, message: "Customer updated successfully!", data };
  } catch (err) {
    result = {
      success: false,
      message: err.originalError?.message || "An unexpected error occurred.",
    };
  }
  return result;
};

const deleteCustomerFDB = async (PhoneNumber) => {
  const pool = await connection();
  const data = await pool
    .request()
    .input("SDT", sql.NVarChar(10), PhoneNumber)
    .execute("sp_DeleteKhachHang");
  return data;
};
const deleteHoaDonWithDetails = async (MAHOADON) => {
  const pool = await connection();
  const data = await pool
    .request()
    .input("MAHOADON", sql.NVarChar(4), MAHOADON)
    .execute("DeleteHoaDonWithDetails");

  return data;
};
const updateInvoiceWithErrors = async (MAHOADON, MANV, TENNHANVIEN) => {
  const pool = await connection();
  const data = await pool
    .request()
    .input("MAHOADON", sql.NVarChar(4), MAHOADON)
    .input("MANV", sql.NVarChar(3), MANV)
    .input("TENNHANVIEN", sql.NVarChar(255), TENNHANVIEN)
    .execute("UpdateInvoiceWithErrors");
  return data;
};
const updateInvoiceAndOrderDetails = async (MAHOADON, TEN, SDT) => {
  const pool = await connection();
  const data = await pool
    .request()
    .input("MAHOADON", sql.NVarChar(4), MAHOADON)
    .input("TEN", sql.NVarChar(255), TEN)
    .input("SDT", sql.NVarChar(10), SDT)
    .execute("UpdateInvoiceAndOrderDetails");

  return data;
};
module.exports = {
  calculateInvoiceWithBranch,
  getBranches,
  calculateBranchRevenueWithDetails,
  getDishes,
  getOrders,
  getBranches,
  getOrdersByPhoneNumber,
  getInvoiceCost,
  insertInvoiceWithDetails,
  getCustomersFDB,
  postCustomerFDB,
  updateCustomerFDB,
  deleteCustomerFDB,
  deleteHoaDonWithDetails,
  updateInvoiceWithErrors,
  updateInvoiceAndOrderDetails,
};
