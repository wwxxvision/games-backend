
class Session {
	constructor(game, player, enemy) {
		this.game = game;
		this.player = player;
		this.enemy = enemy;
	}

	start() {
		const { player, enemy } = this

		const self = this
		player.socket.on("finish", function (number) {
			self.playerNumber = number
			if (self.enemyNumber || self.enemyNumber === 0) {
				self.finish()
			}
		})
		enemy.socket.on("finish", function (number) {
			self.enemyNumber = number
			if (self.playerNumber || self.playerNumber === 0) {
				self.finish()
			}
		})
	}

	finish() {
		const {
			game,
			player,
			enemy,
			status,
			playerNumber,
			enemyNumber
		} = this
		console.log('finish', status)
		game.onSessionFinish(player, status === 'win', enemy)
		player.socket.emit(status, {
			player: playerNumber,
			enemy: enemyNumber
		})
	}
}

module.exports = Session;
