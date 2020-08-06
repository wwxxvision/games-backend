const gameApp = require("./app");

function gameRender(io, socket, roomName) {
  socket.on("game-id", function (idGame) {
    const room = io.sockets.adapter.rooms[roomName];
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
}

module.exports = gameRender;
