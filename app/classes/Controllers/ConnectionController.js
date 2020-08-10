const ConnectionModel = require("../Models/ConnectionModel");

class ConnectionController {
  constructor(db) {
    this.db = db;
    this.connectionModel = new ConnectionModel(this.db);
  }

  async createConnectons(players) {
    const { connectionModel } = this;
    const connections = [];
    for (const player of players) {
      await this.close(player.id);
      const connectionId = await connectionModel.create({
        player_id: player.id,
        socket_id: player.socket_id,
      });
      connections.push(connectionId);
      player.connection_id = connectionId;
    }
    return {
      firstConnection: connections.pop(),
      secondConnection: connections.pop(),
    };
  }

  async isWaiting(player) {
    const { connectionModel } = this;
    const connections = await connectionModel.getWaitngBySocketId(player);
    return !!connections.length;
  }

  async close(player) {
    const { connectionModel } = this;
    return await connectionModel.updateByPlayerId(player, "close");
  }

  async ready(socket) {
    const { connectionModel } = this;
    return await connectionModel.updateBySocketId(socket, "ready");
  }

  // async connect() {
  //   const { socket, room, connectionModel } = this;
  //   const { id: idClient } = socket.conn;
  //   const clientHasConnection = await connectionModel.clientHasConnection(room);

  //   if (!clientHasConnection.length) {
  //     await connectionModel.createConnection(idClient, room);
  //   } else {
  //     await connectionModel.updateConnection(idClient, room);
  //   }

  //   const roomIsFull = await connectionModel.connectionIsFull(room);

  //   if (roomIsFull) {
  //     // dispatch event than is full
  //     this.emit("full-connection");
  //   }
  // }

  // disconnect() {
  //   const { socket, room, connectionModel } = this;
  //   const { id: idClient } = socket.conn;
  //   connectionModel.disconnectConnection(idClient, room);
  // }
}

module.exports = ConnectionController;
