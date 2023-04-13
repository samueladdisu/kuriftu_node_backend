const mysql = require("mysql2");
const config = require("../config");

const pool = mysql.createPool({
  host: config.HOST || "localhost",
  user: config.DBUSER || "root",
  password: config.DBPASSWORD || "",
  database: config.DBNAME || "lalibela",
  // "reservation"
});

module.exports = pool.promise();
