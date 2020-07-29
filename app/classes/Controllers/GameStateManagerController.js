const Game = require("../Models/Game");

class GameStateManagerController {
  manage(socket, io, room, db) {
    const game = new Game(db);
    await game.setGameData(room);
  }
}

module.exports = GameStateManagerController;
