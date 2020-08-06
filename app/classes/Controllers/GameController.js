const Game = require("../Models/GameModel");

class GameController {
  constructor(db) {
    this.db = db;
    this.gameModel = new Game(this.db);
	}

	async createNew(room) {
		const { gameModel } = this;
		return gameModel.create(room)
	}

	async isGameReady(gameId) {
		const { gameModel } = this;
		const game = await gameModel.get(gameId)
		return game.first_connection_status === 'ready' &&
			game.second_connection_status === 'ready'
	}

	async process(gameId) {
		const { gameModel } = this;
		return await gameModel.updateStatus(gameId, 'process');
	}
	
	async finish(gameId) {
		const { gameModel } = this;
		return await gameModel.updateStatus(gameId, 'finish');
  }

	async setWinner(gameId, connectionId) {
		const { gameModel } = this;
		return await gameModel.setWinner(gameId, connectionId);
  }

  // async play(io, room) {
  //   await this.game.setGameData(room);
  //   const { state } = this.game.gameData;

  //   if (state === "waiting") {
  //     await this.game.updateGameState(room, "play", state);
  //     await this.game.setGameData(room);
  //     io.in(room.name).emit("gameUpdated", this.game.gameData);
  //   } else {
  //     io.in(room.name).emit("gameUpdated", { state });
  //   }
  // }

  // async finish(io, room) {
  //   await this.game.updateGameState(room, "finished", "play");
  //   await this.game.setGameData(room);
  //   io.in(room.name).emit("gameUpdated0", this.game.gameData);
  // }
}

module.exports = GameController;
