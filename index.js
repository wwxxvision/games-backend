const gameApp = require("./app");

function gameRender(io, socket, roomName) {
  socket.on("game-id", function (idGame) {
    const newRoomName = `${roomName}-${idGame}`;
    socket.join(newRoomName);
    const room = io.sockets.adapter.rooms[newRoomName];
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
      const socket1 = io.sockets.connected[data.players[0].socket_id];
      const socket2 = io.sockets.connected[data.players[1].socket_id];
      socket1.leave(newRoomName);
      socket2.leave(newRoomName);
      gameApp(
        {
          game: data.game,
          players: data.players,
          initialRoomName: roomName,
        },
        io
      );
    }
  });
  // socket.emit('game-render-started')
}

module.exports = gameRender;
