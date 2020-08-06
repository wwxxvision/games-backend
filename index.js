const nodemon = require("nodemon");
nodemon.emit("quit");

const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = 3010 || process.evn.PORT;
const gameApp = require("./app");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("game-id", function (idGame) {
    socket.join(idGame);
    const room = io.sockets.adapter.rooms[idGame];
    if (room && room.length === 2) {
      const sockets = Object.keys(room.sockets);
      const data = {
        game: `game${idGame}`,
        players: [
          {
            id: 1,
            socket_id: sockets[0],
          },
          {
            id: 2,
            socket_id: sockets[1],
          },
        ],
      };
      gameApp(
        {
          game: data.game,
          players: data.players,
        },
        io
      );
    }
  });
});

http.listen(PORT, () => {});
