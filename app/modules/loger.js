const log4js = require("log4js");
const path = require("path");

log4js.configure({
  appenders: { appLogger: { type: "file", filename: "app.log" } },
  categories: { default: { appenders: ["appLogger"], level: "info" } },
});
const logger = log4js.getLogger();

module.exports = logger;
