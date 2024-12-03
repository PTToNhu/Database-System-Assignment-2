const {CalculateInvoiceWithBranch}=require("../routes/api.js")
const getHomepage = (req, res) => {
    const ex = CalculateInvoiceWithBranch('2024-11-17 00:00:00', '2024-11-20 23:59:59', 'C01')
    console.log(ex)
    res.render("home.ejs")
}
module.exports={getHomepage}