const log4js = require("log4js");
log4js.configure({
  appenders: { cheese: { type: "file", filename: "/app/logs/debug.log" } },
  categories: { default: { appenders: ["debug"], level: "debug" } },
});
const logger = log4js.getLogger("debug");

module.exports = logger;
