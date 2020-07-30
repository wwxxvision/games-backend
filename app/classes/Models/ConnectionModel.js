const DatabaseManager = require("../System/DatabaseManager");

class ConnectionModel {
  constructor(db) {
    this.db = new DatabaseManager(db);
    this.MAX_CONNECTIONS = 2;
  }

  async clientHasConnection(room) {
    return await this.db.select(`* FROM games WHERE id='${room.name}'`);
  }

  async createConnection(idClient, room) {
    await this.db.insert(
      `INTO games (id, state) VALUES ('${room.name}', 'waiting')`
    );
    await this.db.insert(
      `INTO players (id, state) VALUES ('${idClient}', 'default')`
    );
    await this.db.insert(
      `INTO rooms (player_id, game_id) VALUES ('${idClient}', '${room.name}')`
    );
  }

  async updateConnection(idClient, room) {
    const countConnections = await this.db.select(
      `* FROM rooms WHERE game_id='${room.name}'`
    );

    if (countConnections.length < this.MAX_CONNECTIONS) {
      await this.db.insert(
        `INTO players (id, state) VALUES ('${idClient}', 'default')`
      );
      await this.db.insert(
        `INTO rooms (player_id, game_id) VALUES ('${idClient}', '${room.name}')`
      );
    }
  }

  async disconnectConnection(idClient, room) {
    await this.db.delete(`FROM rooms WHERE player_id='${idClient}'`);
    await this.db.delete(`FROM players WHERE id='${idClient}'`);

    const hasPlayersInRoom = await this.db.select(
      `* FROM rooms WHERE game_id='${room.name}'`
    );
    if (!hasPlayersInRoom.length) {
      await this.db.delete(`FROM games WHERE id='${room.name}'`);
    }
  }

  async connectionIsFull(room) {
    const countConnections = await this.db.select(
      `* FROM rooms WHERE game_id='${room.name}'`
    );

    return countConnections.length === this.MAX_CONNECTIONS;
  }
}

module.exports = ConnectionModel;
