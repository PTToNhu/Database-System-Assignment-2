const { calculateInvoiceWithBranch, getBranches, calculateBranchRevenueWithDetails } = require("../routes/api")
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
    const { startDate, endDate, branch } = req.body || req.query;

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} 00:00:00`;
    };

    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    console.log('formattedStartDate:', formattedStartDate);
    console.log('formattedEndDate:', formattedEndDate);
    try {
        if (branch === ``) {
            invoices = await calculateInvoiceWithBranch(formattedStartDate, formattedEndDate);
        } else {
            invoices = await calculateInvoiceWithBranch(formattedStartDate, formattedEndDate, branch);
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
    const branches = await getBranches();
    const { startDate, endDate, minRevenue, minInvoices } = req.body || req.query;

    const formattedStartDate = `${startDate} 00:00:00`;
    const formattedEndDate = `${endDate} 23: 59: 59`;
    const formattedminRevenue = parseInt(minRevenue, 10) || 0; // Chuyển sang số nguyên
    const formattedminInvoices = parseFloat(minInvoices) || 0.0;  // Chuyển sang số thực

    console.log('formattedStartDate:', formattedStartDate);
    console.log('formattedEndDate:', formattedEndDate);

    // lists = await calculateBranchRevenueWithDetails
    //     (formattedStartDate, formattedEndDate, formattedminRevenue, formattedminInvoices)
    // res.render("revenue.ejs", { lists: lists });
    try {
        lists = await calculateBranchRevenueWithDetails
            (formattedStartDate, formattedEndDate, formattedminRevenue, formattedminInvoices);
        // Render trang với dữ liệu hoá đơn
        res.render("revenue.ejs", { lists: lists });

    } catch (error) {
        console.error("Error in postInvoicepage:", error);
        res.render("revenue.ejs", { lists: [], error: "Error fetching invoices." });
    }
}
module.exports = { getHomepage, getInvoicepage, postInvoicepage, getRevenuepage, postRevenuepage }