class Game {
	constructor(
		gameController,
		connectionController,
		room,
		roomName,
		gameId,
		io
	) {
		this.gameController = gameController;
		this.connectionController = connectionController;
		this.players = room.players.map((player) => {
			const socket = io.sockets.connected[player.socket_id]
			socket.removeAllListeners()
			return {
				...player,
				socket: socket
			}
		});
		this.room = room;
		this.roomName = roomName;
		this.gameId = gameId;
		this.io = io;
		this.firstFinished = false;
		this.setInitValues()
	}

	setInitValues() { }

	async init() {
		const { players } = this;
		for (const player of players) {
			const enemy = players.find((obj) => obj.id !== player.id);
			await this.createSession(player, enemy);
		}
	}

	async createSession(player, enemy) {
		const {
			roomName,
			gameId,
			io,
			serverNumber,
			connectionController,
			gameController,
		} = this;
		const self = this;

		player.socket.join(roomName);
		player.socket.on("ready", async function () {
			if (!await connectionController.isWaiting(player.socket_id)) return
			await connectionController.ready(player.socket_id);
			self.initAndStartSession(self, player, enemy)

			const isGameReady = await gameController.isGameReady(gameId);
			if (isGameReady) {
				await gameController.process(gameId);
				io.to(roomName).emit("play");
				self.onGameStart()
			}
		});

		player.socket.on("disconnect", async function () {
			enemy.socket.emit("partner-disconnect");
			self.onSessionFinish(player, false);
			self.onSessionFinish(enemy, true);
		});
	}

	onGameStart() { }

	initAndStartSession(self, player, enemy) {
		const { room } = this
		const Session = require(`./${room.game}/session`)
		const session = new Session(self, player, enemy)
		session.start()
	}

	onSessionFinish(player, winner, enemy) {
		const { room, io, gameId, connectionController, gameController } = this;
		connectionController.close(player.id);
		if (winner) gameController.setWinner(player.connection_id);
		if (this.firstFinished) gameController.finish(gameId);
		this.firstFinished = true;
		if (enemy) {
			player.socket.on("play-again", function () {
				enemy.socket.emit("partner-play-again");
				enemy.socket.on("accept-play-again", function () {
					const gameApp = require("../");
					gameApp(room, io);
				});
			});
		}
	}
}

module.exports = Game;
