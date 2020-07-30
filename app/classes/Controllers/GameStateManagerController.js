const Game = require("../Models/Game");

class GameStateManagerController {
  constructor(db) {
    this.db = db;
    this.game = new Game(db);
  }

  async play(io, room) {
    await this.game.setGameData(room);
    const { state } = this.game.gameData;

    if (state === "waiting") {
      await this.game.updateGameState(room, "play", state);
      await this.game.setGameData(room);
      io.in(room.name).emit("gameUpdated", this.game.gameData);
    } else {
      io.in(room.name).emit("gameUpdated", { state });
    }
  }

  async finish(io, room) {
    await this.game.updateGameState(room, "finished", "play");
    await this.game.setGameData(room);
    io.in(room.name).emit("gameUpdated0", this.game.gameData);
  }
}

module.exports = GameStateManagerController;
