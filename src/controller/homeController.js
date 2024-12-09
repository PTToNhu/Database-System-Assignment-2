const { calculateInvoiceWithBranch, getBranches,
    calculateBranchRevenueWithDetails, deleteHoaDonWithDetails
    , updateInvoiceWithErrors, updateInvoiceAndOrderDetails } = require("../routes/api")
var { connection } = require('../config/database')
const getHomepage = async (req, res) => {
    res.render("home.ejs")
}
const getInvoicepage = async (req, res) => {
    const branches = await getBranches()
    //const invoices = await calculateInvoiceWithBranch('2024-11-17 00:00:00', '2024-11-20 23:59:59', 'C01')
    res.render("invoices.ejs", { invoices: [], branches: branches })
}
const postInvoicepage = async (req, res) => {
    const branches = await getBranches();
    const { startDate, endDate, branch, sortByProfit } = req.body || req.query;

    const formatDate = (date, isStart = true) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');

        // Tự động thêm thời gian 00:00:00 hoặc 23:59:59
        const time = isStart ? '00:00:00' : '23:59:59';
        return `${year}-${month}-${day} ${time}`;
    };

    const formattedStartDate = formatDate(startDate, true);  // Thêm 00:00:00
    const formattedEndDate = formatDate(endDate, false);    // Thêm 23:59:59

    console.log('formattedStartDate:', formattedStartDate);
    console.log('formattedEndDate:', formattedEndDate);
    console.log('sortByProfit:', sortByProfit); // Kiểm tra giá trị của biến sortByProfit

    // Convert sortByProfit to a BIT (1 or 0)
    const sortByProfitBit = sortByProfit === '1' ? 1 : 0;  // Ensure it's either 1 or 0

    try {
        if (branch === ``) {
            invoices = await calculateInvoiceWithBranch(formattedStartDate, formattedEndDate, sortByProfitBit);
        } else {
            invoices = await calculateInvoiceWithBranch(formattedStartDate, formattedEndDate, sortByProfitBit, branch);
        }

        // Render trang với dữ liệu hoá đơn
        res.render("invoices.ejs", { invoices: invoices, branches: branches });
    } catch (error) {
        console.error("Error in postInvoicepage:", error);
        res.render("invoices.ejs", { invoices: [], branches: branches, error: "Error fetching invoices." });
    }
}

const getRevenuepage = async (req, res) => {
    res.render("revenue.ejs", { lists: [] })
}
const postRevenuepage = async (req, res) => {
    const { startDate, endDate, minRevenue, minInvoices, sortByProfit } = req.body || req.query;

    const formatDate = (date, isStart = true) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');

        // Tự động thêm thời gian 00:00:00 hoặc 23:59:59
        const time = isStart ? '00:00:00' : '23:59:59';
        return `${year}-${month}-${day} ${time}`;
    };

    const formattedStartDate = formatDate(startDate, true);  // Thêm 00:00:00
    const formattedEndDate = formatDate(endDate, false);    // Thêm 23:59:59
    const formattedminRevenue = parseInt(minRevenue, 10) || 0; // Chuyển sang số nguyên
    const formattedminInvoices = parseFloat(minInvoices) || 0.0;  // Chuyển sang số thực

    console.log('formattedStartDate:', formattedStartDate);
    console.log('formattedEndDate:', formattedEndDate);
    console.log('formattedminRevenue:', formattedminRevenue);
    console.log('formattedminInvoices:', formattedminInvoices);

    const sortByProfitBit = sortByProfit === '1' ? 1 : 0;
    console.log('sortByProfit:', sortByProfit);
    // lists = await calculateBranchRevenueWithDetails
    //     (formattedStartDate, formattedEndDate, formattedminRevenue, formattedminInvoices)
    // res.render("revenue.ejs", { lists: lists });
    try {
        lists = await calculateBranchRevenueWithDetails
            (formattedStartDate, formattedEndDate, sortByProfitBit, formattedminRevenue, formattedminInvoices);
        // Render trang với dữ liệu hoá đơn
        res.render("revenue.ejs", { lists: lists });

    } catch (error) {
        console.error("Error in postRevenuepage:", error);
        res.render("revenue.ejs", { lists: [], error: "Error fetching invoices." });
    }
}
const deleteInvoice = async (req, res) => {
    const { invoiceId } = req.params; // Lấy invoiceId từ URL
    console.log('invoiceId:', invoiceId); // Kiểm tra xem invoiceId có đúng không

    try {
        const formattedInvoiceId = invoiceId.toString().slice(-4);
        // Gọi stored procedure để xóa hóa đơn
        await deleteHoaDonWithDetails(formattedInvoiceId);
        console.log('Successfully deleted invoice:', formattedInvoiceId); // Kiểm tra xem thủ tục có được gọi thành công không

        // Trả về phản hồi thành công
        res.json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
        console.error('Error during invoice deletion:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }

}

const updateEmployee = async (req, res) => {
    try {
        // Lấy dữ liệu từ body của request
        const { employeeID, employeeName, invoiceID } = req.body;

        // In ra console để kiểm tra
        console.log('Employee ID:', employeeID);
        console.log('Employee Name:', employeeName);
        console.log('invoiceId :', invoiceID);

        data = await updateInvoiceWithErrors(invoiceID, employeeID, employeeName);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error processing updateEmployee:', error);

        // Trả về phản hồi lỗi
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing the request.',
        });
    }
}

const updateCustomer = async (req, res) => {
    try {
        // Lấy dữ liệu từ body của request
        const { customerPhone, customerName, invoiceID } = req.body;

        // In ra console để kiểm tra
        console.log('Customer Phone:', customerPhone);
        console.log('Customer Name:', customerName);
        console.log('invoiceId :', invoiceID);

        data = await updateInvoiceAndOrderDetails(invoiceID, customerName, customerPhone);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error processing updateEmployee:', error);

        // Trả về phản hồi lỗi
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing the request.',
        });
    }
}

module.exports = {
    getHomepage, getInvoicepage, postInvoicepage, getRevenuepage,
    postRevenuepage, deleteInvoice, updateEmployee, updateCustomer
}