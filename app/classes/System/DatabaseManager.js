const { logger } = require("../../modules");

class DatabaseManager {
  constructor(database) {
    this.database = database;
  }

  select(queryString) {
    return new Promise((resolve) => {
      this.database.query(
        { sql: `SELECT ${queryString}`, timeout: 50000 },
        (err, result) => {
          if (err) logger.error(err);

          resolve(result);
        }
      );
    });
  }

  insert(queryString) {
    return new Promise((resolve) => {
      this.database.query(
        { sql: `INSERT ${queryString}`, timeout: 50000 },
        (err, result) => {
          if (err) logger.error(err);

          resolve(result.insertId);
        }
      );
    });
  }

  update(queryString) {
    return new Promise((resolve) => {
      this.database.query(
        { sql: `UPDATE ${queryString}`, timeout: 50000 },
        (err, result) => {
          if (err) logger.error(err);

          resolve(result);
        }
      );
    });
  }

  delete(queryString) {
    return new Promise((resolve) => {
      this.database.query(
        { sql: `DELETE ${queryString}`, timeout: 50000 },
        (err, result) => {
          if (err) logger.error(err);

          resolve(result);
        }
      );
    });
  }
}

module.exports = DatabaseManager;
