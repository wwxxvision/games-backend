const ConnectionModel = require("../Models/ConnectionModel");
const GameStateManagerController = require("../Controllers/GameStateManagerController");
const { logger } = require("../../modules");

class ConnectionController {
  async connect(socket, io, room, db) {
    const connectionModel = new ConnectionModel(db);
    const { id: idClient } = socket.conn;
    const clientHasConnection = await connectionModel.clientHasConnection(room);

    if (!clientHasConnection.length) {
      await connectionModel.createConnection(idClient, room);
    } else {
      await connectionModel.updateConnection(idClient, room);
    }

    if (connectionModel.connectionIsFull(room)) {
      GameStateManagerController.manage(socket, io, room, db);
    }

    socket.on("disconnect", () => {
      connectionModel.disconnectConnection(idClient, room);
    });
  }
}

module.exports = new ConnectionController();
