const DatabaseManager = require("../System/DatabaseManager");

class Game {
  constructor(db) {
    this.db = new DatabaseManager(db);
    this.data = null;
  }

  async setGameData(room) {
    const result = await this.db.select(`* FROM games WHERE id='${room.name}'`);
    if (result) {
      this.data = result[0];
    }
  }

  get gameData() {
    return this.data;
  }

  async updateGameState(room, state, prevState) {
    const result = await this.db.update(
      `games SET state = '${state}' WHERE id='${room.name}'`
    );

    if (result) {
      return state;
    }

    return prevState;
  }
}

module.exports = Game;
