const {
  getOrders,
  getBranches,
  insertInvoiceWithDetails,
  getInvoiceCost,
  calculateInvoiceWithBranch,
  calculateBranchRevenueWithDetails,
  getCustomersFDB,
  postCustomerFDB,
  updateCustomerFDB,
  deleteCustomerFDB,
  deleteHoaDonWithDetails,
  updateInvoiceWithErrors,
  updateInvoiceAndOrderDetails,
} = require("../routes/api");
var { connection } = require("../config/database");
const moment = require("moment-timezone");
const orderPage = async (req, res) => {
  // const sdt = req.query.sdt
  // console.log(`sdt: ${sdt}`)
  // if (sdt) {
  //     if (sdt.length != 9) {
  //         // console.log("chiều dài chuỗi không hợp lệ")
  //         res.send("số điện thoại không hợp lệ, vui lòng nhập lại")
  //     }
  //     else {
  //         const orders = await getOrdersByPhoneNumber(sdt)
  //         // if (orders) { console.log(orders.recordset) }
  //         // else { console.log("không tìm thấy đơn hàng ứng với số điện thoại khách hàng vừa tìm") }
  //         res.render("order.ejs", { orders: orders.recordset })
  //     }
  // }
  // else {
  //     const orders = await getOrders()
  //     res.render("order.ejs", { orders: orders.recordset })
  // }
  try {
    const orders = await getOrders();
    console.log(orders.recordset);
    res.render("order.ejs", { orders: orders.recordset });
  } catch {
    console.error("Đã xảy ra lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).send("Đã xảy ra lỗi trong hệ thống, vui lòng thử lại sau.");
  }
};
const getPaymentPage = async (req, res) => {
  res.render("payment.ejs", { madonhang: req.params.orderid });
};
const postPaymentPage = async (req, res) => {
  try {
    console.log(`params ${req.params.orderid}`);
    console.log(req.body);
    const MADONHANG = req.params.orderid;
    const { MAHOADON, THOIGIAN, MANV, SDT } = req.body;
    let date = new Date(THOIGIAN);
    date.setHours(date.getHours() + 7);
    console.log(`thoi gian ${date}`);

    const invoice = await insertInvoiceWithDetails(
      MAHOADON,
      date,
      MADONHANG,
      MANV,
      SDT
    );
    const data = await getInvoiceCost(MADONHANG, date, SDT);
    console.log(data.recordset[0]);
    res.render("detailPayment.ejs", { invoiceDetail: data.recordset[0] });
  } catch {
    console.error("Đã xảy ra lỗi khi xử lý thanh toán:", error);
    res
      .status(500)
      .send(
        "Đã xảy ra lỗi trong quá trình xử lý thanh toán. Vui lòng thử lại sau."
      );
  }
};
const getHomepage = async (req, res) => {
  res.render("home.ejs");
};
const getInvoicepage = async (req, res) => {
  const branches = await getBranches();
  //const invoices = await calculateInvoiceWithBranch('2024-11-17 00:00:00', '2024-11-20 23:59:59', 'C01')
  res.render("invoices.ejs", {
    invoices: [],
    branches: branches,
    moment: moment,
  });
};
const postInvoicepage = async (req, res) => {
  const branches = await getBranches();
  const { startDate, endDate, branch, sortByProfit } = req.body || req.query;

  const formatDate = (date, isStart = true) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");

    // Tự động thêm thời gian 00:00:00 hoặc 23:59:59
    const time = isStart ? "00:00:00" : "23:59:59";
    return `${year}-${month}-${day} ${time}`;
  };

  const formattedStartDate = formatDate(startDate, true); // Thêm 00:00:00
  const formattedEndDate = formatDate(endDate, false); // Thêm 23:59:59

  console.log("formattedStartDate:", formattedStartDate);
  console.log("formattedEndDate:", formattedEndDate);
  console.log("sortByProfit:", sortByProfit); // Kiểm tra giá trị của biến sortByProfit

  // Convert sortByProfit to a BIT (1 or 0)
  const sortByProfitBit = sortByProfit === "1" ? 1 : 0; // Ensure it's either 1 or 0

  try {
    if (branch === ``) {
      invoices = await calculateInvoiceWithBranch(
        formattedStartDate,
        formattedEndDate,
        sortByProfitBit
      );
    } else {
      invoices = await calculateInvoiceWithBranch(
        formattedStartDate,
        formattedEndDate,
        sortByProfitBit,
        branch
      );
    }

    // Render trang với dữ liệu hoá đơn
    res.render("invoices.ejs", {
      invoices: invoices,
      branches: branches,
      moment: moment,
    });
  } catch (error) {
    console.error("Error in postInvoicepage:", error);
    res.render("invoices.ejs", {
      invoices: [],
      branches: branches,
      error: "Error fetching invoices.",
    });
  }
};

const getRevenuepage = async (req, res) => {
  res.render("revenue.ejs", { lists: [] });
};
const postRevenuepage = async (req, res) => {
  const { startDate, endDate, minRevenue, minInvoices, sortByProfit } =
    req.body || req.query;

  const formatDate = (date, isStart = true) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");

    // Tự động thêm thời gian 00:00:00 hoặc 23:59:59
    const time = isStart ? "00:00:00" : "23:59:59";
    return `${year}-${month}-${day} ${time}`;
  };

  const formattedStartDate = formatDate(startDate, true); // Thêm 00:00:00
  const formattedEndDate = formatDate(endDate, false); // Thêm 23:59:59
  const formattedminRevenue = parseInt(minRevenue, 10) || 0; // Chuyển sang số nguyên
  const formattedminInvoices = parseFloat(minInvoices) || 0.0; // Chuyển sang số thực

  console.log("formattedStartDate:", formattedStartDate);
  console.log("formattedEndDate:", formattedEndDate);
  console.log("formattedminRevenue:", formattedminRevenue);
  console.log("formattedminInvoices:", formattedminInvoices);

  const sortByProfitBit = sortByProfit === "1" ? 1 : 0;
  console.log("sortByProfit:", sortByProfit);
  // lists = await calculateBranchRevenueWithDetails
  //     (formattedStartDate, formattedEndDate, formattedminRevenue, formattedminInvoices)
  // res.render("revenue.ejs", { lists: lists });
  try {
    lists = await calculateBranchRevenueWithDetails(
      formattedStartDate,
      formattedEndDate,
      sortByProfitBit,
      formattedminRevenue,
      formattedminInvoices
    );
    // Render trang với dữ liệu hoá đơn
    res.render("revenue.ejs", { lists: lists });
  } catch (error) {
    console.error("Error in postRevenuepage:", error);
    res.render("revenue.ejs", { lists: [], error: "Error fetching invoices." });
  }
};
const deleteInvoice = async (req, res) => {
  const { invoiceId } = req.params; // Lấy invoiceId từ URL
  console.log("invoiceId:", invoiceId); // Kiểm tra xem invoiceId có đúng không

  try {
    const formattedInvoiceId = invoiceId.toString().slice(-4);
    // Gọi stored procedure để xóa hóa đơn
    await deleteHoaDonWithDetails(formattedInvoiceId);
    console.log("Successfully deleted invoice:", formattedInvoiceId); // Kiểm tra xem thủ tục có được gọi thành công không

    // Trả về phản hồi thành công
    res.json({ success: true, message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error during invoice deletion:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateEmployee = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const { employeeID, employeeName, invoiceID } = req.body;

    // In ra console để kiểm tra
    console.log("Employee ID:", employeeID);
    console.log("Employee Name:", employeeName);
    console.log("invoiceId :", invoiceID);

    data = await updateInvoiceWithErrors(invoiceID, employeeID, employeeName);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error processing updateEmployee:", error);

    // Trả về phản hồi lỗi
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
};

const updateCustomerT = async (req, res) => {
  try {
    // Lấy dữ liệu từ body của request
    const { customerPhone, customerName, invoiceID } = req.body;

    // In ra console để kiểm tra
    console.log("Customer Phone:", customerPhone);
    console.log("Customer Name:", customerName);
    console.log("invoiceId :", invoiceID);

    data = await updateInvoiceAndOrderDetails(
      invoiceID,
      customerName,
      customerPhone
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error processing updateEmployee:", error);

    // Trả về phản hồi lỗi
    res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
};

module.exports = {};
const getCustomers = async (req, res) => {
  const customers = await getCustomersFDB();
  // console.log(customers.recordset)
  const message = req.query.message;
  res.render("customer.ejs", {
    customers: customers.recordset,
    message: message,
  });
};
const postCustomer = async (req, res) => {
  console.log(req.body);
  const { Name, PhoneNumber } = req.body;
  const customer = await postCustomerFDB(Name, PhoneNumber);
  const message = customer.success
    ? `Success: ${customer.message}`
    : `Error: ${customer.message}`;
  console.log(customer);
  res.redirect(`/customer?message=${encodeURIComponent(message)}`);
};
const updateCustomer = async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const customer = await updateCustomerFDB(req.body.TEN, req.params.SDT);
  const message = customer.success
    ? `Success: ${customer.message}`
    : `Error: ${customer.message}`;
  console.log(customer);
  res.redirect(`/customer?message=${encodeURIComponent(message)}`);
};
const deleteCustomer = async (req, res) => {
  console.log(req.params);
  const customer = await deleteCustomerFDB(req.params.SDT);
  const message = customer.success
    ? `Success: ${customer.message}`
    : `Error: ${customer.message}`;
  console.log(customer);
  res.redirect(`/customer?message=${encodeURIComponent(message)}`);
};

module.exports = {
  orderPage,
  getPaymentPage,
  postPaymentPage,
  getHomepage,
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
  updateCustomerT,
};
