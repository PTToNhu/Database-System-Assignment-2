const { getOrders, getBranches, getOrdersByPhoneNumber } = require("../routes/api")
const getHomepage = (req, res) => {
    res.render("home.ejs")
}
const orderPage = async (req, res) => {
    const sdt = req.query.sdt
    console.log(`sdt: ${sdt}`)
    if (sdt) {
        if (sdt.length != 9) {
            console.log("chiều dài chuỗi không hợp lệ")
            res.send("số điện thoại không hợp lệ, vui lòng nhập lại")
        }
        else {
            const orders = await getOrdersByPhoneNumber(sdt)
            if (orders) { console.log(orders.recordset) }
            else { console.log("không tìm thấy đơn hàng ứng với số điện thoại khách hàng vừa tìm") }
            res.render("order.ejs", { orders: orders.recordset })
        }
    }
    else {
        const orders = await getOrders()
        res.render("order.ejs", { orders: orders.recordset })
    }
    // if (sdt) {orders = await getOrdersByPhoneNumber(sdt)}
    // else {
    //     orders = await getOrders()
    // }
    // const branches= await getBranches()
    // const orders = await getOrders()
    // res.render("order.ejs", { orders: orders.recordset })
    // res.render("order.ejs", {orders: orders && orders.recordset ? orders.recordset : [],
    //                         branches: branches.recordset})
}
const postPaymentPage = async (req, res) => {
    res.render('payment.ejs', { madonhang: req.params.orderid })
}
module.exports = { getHomepage, orderPage, postPaymentPage }