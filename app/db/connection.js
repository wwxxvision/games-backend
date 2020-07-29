require("dotenv").config();
const mysql = require("mysql2");

module.exports = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  });

  connection.connect((err) => console.log(err));

  return connection;
};
