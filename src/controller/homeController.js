const {
  getOrders,
  getBranches,
  insertInvoiceWithDetails,
  getInvoiceCost,
  calculateInvoiceWithBranch,
  calculateBranchRevenueWithDetails,
} = require("../routes/api");
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
    // console.log(`params ${req.params.orderid}`)
    // console.log(req.body)
    const MADONHANG = req.params.orderid;
    const { MAHOADON, THOIGIAN, MANV, SDT } = req.body;
    let date = new Date(THOIGIAN);
    date.setHours(date.getHours() + 7);
    console.log(`thoi gian ${date}`);

    await insertInvoiceWithDetails(MAHOADON, date, MADONHANG, MANV, SDT);
    const data = await getInvoiceCost(MAHOADON);
    console.log(data.reFcordset[0]);
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
  res.render("invoices.ejs", { invoices: [], branches: branches });
};
const postInvoicepage = async (req, res) => {
  const branches = await getBranches();
  const { startDate, endDate, branch } = req.body || req.query;

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} 00:00:00`;
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  console.log("formattedStartDate:", formattedStartDate);
  console.log("formattedEndDate:", formattedEndDate);
  try {
    if (branch === ``) {
      invoices = await calculateInvoiceWithBranch(
        formattedStartDate,
        formattedEndDate
      );
    } else {
      invoices = await calculateInvoiceWithBranch(
        formattedStartDate,
        formattedEndDate,
        branch
      );
    }

    // Render trang với dữ liệu hoá đơn
    res.render("invoices.ejs", { invoices: invoices, branches: branches });
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
  const branches = await getBranches();
  const { startDate, endDate, minRevenue, minInvoices } = req.body || req.query;

  const formattedStartDate = `${startDate} 00:00:00`;
  const formattedEndDate = `${endDate} 23: 59: 59`;
  const formattedminRevenue = parseInt(minRevenue, 10) || 0; // Chuyển sang số nguyên
  const formattedminInvoices = parseFloat(minInvoices) || 0.0; // Chuyển sang số thực

  console.log("formattedStartDate:", formattedStartDate);
  console.log("formattedEndDate:", formattedEndDate);

  // lists = await calculateBranchRevenueWithDetails
  //     (formattedStartDate, formattedEndDate, formattedminRevenue, formattedminInvoices)
  // res.render("revenue.ejs", { lists: lists });
  try {
    lists = await calculateBranchRevenueWithDetails(
      formattedStartDate,
      formattedEndDate,
      formattedminRevenue,
      formattedminInvoices
    );
    // Render trang với dữ liệu hoá đơn
    res.render("revenue.ejs", { lists: lists });
  } catch (error) {
    console.error("Error in postInvoicepage:", error);
    res.render("revenue.ejs", { lists: [], error: "Error fetching invoices." });
  }
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
};
