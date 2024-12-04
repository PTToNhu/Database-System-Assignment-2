const express = require("express");
const cors = require('cors');
const configViewEngine = require("./config/viewEngine");
require('dotenv').config()

const app = express();
app.use(cors());
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME || 'localhost';
const webRoutes = require('./routes/web')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//config template engine
configViewEngine(app)

app.use('/', webRoutes)

app.listen(port, function () {
  console.log(`App is listening on http://${hostname}:${port}`);
});