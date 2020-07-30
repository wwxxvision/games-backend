const { logger } = require("../../modules");

class DatabaseManager {
  constructor(database) {
    this.database = database;
  }

  select(queryString) {
    return new Promise((resolve) => {
      this.database.query(`SELECT ${queryString}`, (err, result) => {
        if (err) logger.error(err);

        resolve(result);
      });
    });
  }

  insert(queryString) {
    return new Promise((resolve) => {
      this.database.query(`INSERT ${queryString}`, (err, result) => {
        console.log(err);
        if (err) logger.error(err);

        resolve(result);
      });
    });
  }

  update(queryString) {
    return new Promise((resolve) => {
      this.database.query(`UPDATE ${queryString}`, (err, result) => {
        if (err) logger.error(err);

        resolve(result);
      });
    });
  }

  delete(queryString) {
    return new Promise((resolve) => {
      this.database.query(`DELETE ${queryString}`, (err, result) => {
        console.log(err);
        if (err) logger.error(err);

        resolve(result);
      });
    });
  }
}

module.exports = DatabaseManager;
