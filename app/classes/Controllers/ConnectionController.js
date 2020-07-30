const ConnectionModel = require("../Models/ConnectionModel");
const EventEmitter = require("events");

class ConnectionController extends EventEmitter {
  constructor(socket, io, room, db) {
    super();
    this.socket = socket;
    this.io = io;
    this.room = room;
    this.db = db;
    this.connectionModel = new ConnectionModel(this.db);
  }
  async connect() {
    const { socket, room, connectionModel } = this;
    const { id: idClient } = socket.conn;
    const clientHasConnection = await connectionModel.clientHasConnection(room);

    if (!clientHasConnection.length) {
      await connectionModel.createConnection(idClient, room);
    } else {
      await connectionModel.updateConnection(idClient, room);
    }

    const roomIsFull = await connectionModel.connectionIsFull(room);

    if (roomIsFull) {
      // dispatch event than is full
      this.emit("full-connection");
    }
  }

  disconnect() {
    const { socket, room, connectionModel } = this;
    const { id: idClient } = socket.conn;
    connectionModel.disconnectConnection(idClient, room);
  }
}

module.exports = ConnectionController;
