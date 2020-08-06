const ParentSession = require("../session")

class Session extends ParentSession {
	constructor(game, player, enemy, serverNumber) {
		super(game, player, enemy)
		this.serverNumber = serverNumber;
	}

	start() {
		const { player, enemy } = this
		player.socket.on("number-change", function (number) {
			enemy.socket.emit("partner-change", number)
		})

		super.start()
	}

	finish() {
		const {
			player,
			playerNumber,
			enemyNumber,
			serverNumber,
			getDelta,
		} = this

		player.socket.emit("server-number", serverNumber)
		const playerDelta = getDelta(serverNumber, playerNumber)
		const enemyDelta = getDelta(serverNumber, enemyNumber)

		this.status = playerDelta === enemyDelta
			? 'standoff'
			: playerDelta < enemyDelta ? 'win' : 'lose'

		super.finish()
	}

	getDelta(serever, number) {
		return Math.abs(serever - number)
	}
}

module.exports = Session;
