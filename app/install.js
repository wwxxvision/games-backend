const ConnectionController = require("./classes/Controllers/ConnectionController");
const GameController = require("./classes/Controllers/GameController");

module.exports = function (db) {
	return async function (room, io) {
		const connectionController = new ConnectionController(db);
		const gameController = new GameController(db);

		const connections = await connectionController.createConnectons(
			room.players
		);

		const gameId = await gameController.createNew({
			game: room.game,
			...connections,
		});

		const roomName = `game:${gameId}`

		const GameClass = require(`./games/${room.game}`);
		const game = new GameClass(
			gameController,
			connectionController,
			room,
			roomName,
			gameId,
			io
		)

		await game.init()
		io.to(roomName).emit('start');
	};
};
