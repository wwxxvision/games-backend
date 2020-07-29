require("dotenv").config();
const mysql = require("mysql2");
const { logger } = require("../modules");

module.exports = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });

  connection.connect((err) => logger.error(err));

  return connection;
};
