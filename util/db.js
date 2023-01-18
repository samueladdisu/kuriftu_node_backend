const mysql = require('mysql2');
const config = require('../config');

const pool = mysql.createPool({
  host: config.HOST,
  user: config.DBUSER,
  password: config.DBPASSWORD,
  database: config.DBNAME,
});

module.exports = pool.promise();