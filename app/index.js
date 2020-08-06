const installMysql = require("./db/connection");
const mysql = installMysql();
const gameAppInstaller = require("./install");
const gameApp = gameAppInstaller(mysql);

module.exports = (room, io) => gameApp(room, io);
