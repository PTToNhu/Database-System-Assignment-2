const express = require("express");
const configViewEngine = require("./config/viewEngine");
require('dotenv').config()

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;
const webRoutes = require('./routes/web')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//config template engine
configViewEngine(app)

app.use('/', webRoutes)

app.listen(port, function () {
  console.log(`Example app listening on ${hostname}:${port}!`);
});