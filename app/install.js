const ConnectionController = require("./classes/Controllers/ConnectionController");
const GameStateManagerController = require("./classes/Controllers/GameStateManagerController");

module.exports = function (db) {
  return function (socket, io, room) {
    const connectionController = new ConnectionController(socket, io, room, db);
    const gameStateManagerController = new GameStateManagerController(db);

    connectionController.connect();
    connectionController.on("full-connection", function () {
      gameStateManagerController.play(io, room);
    });

    socket.on("disconnect", function () {
      gameStateManagerController.finish(io, room, socket);
      connectionController.disconnect();
    });
  };
};
