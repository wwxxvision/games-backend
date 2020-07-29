const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = 3005 || process.evn.PORT;
const installMysql = require("./app/db/connection");
const mysql = installMysql();

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

// io.on("connection", (socket) => {
//   socket.join("chat");
//   // console.log(socket.adapter.rooms);

//   let prepareSocket = {
//     connection: socket.conn.id,
//     partner: {},
//     room: socket.adapter.rooms.chat,
//     valid: true,
//     nickname: "Jora",
//   };

//   dispatchSocketForChatGames(socket, prepareSocket, io);
// });

http.listen(PORT, () => {
  console.log("listening on *:3005");
});
