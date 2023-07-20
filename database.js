const mysql = require('mysql2');
require("dotenv").config()
const host = process.env.ACCESS_MYSQL_HOST
const user = process.env.ACCESS_MYSQL_USER
const password = process.env.ACCESS_MYSQL_PASSWORD
const port = process.env.ACCESS_MYSQL_PORT

const dbConnection = mysql.createPool({
    host: host,
    user: user,
    password: password,
    port: port,
    database: "e_property_folder"
}).promise()

module.exports = dbConnection