require('dotenv').config()
const sql = require('mssql')

const config = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
    instancename: process.env.DB_INSTANCENAME
  },
  port: 1433
}

const connection =()=>{
  return sql.connect(config);
}

module.exports = {
  connection
};

