
const ParentSession = require("../session")

class Session extends ParentSession {
	start() {
		const { game, player, enemy } = this

		player.socket.on("player-click", function (data) {
			if (data.x !== game.coordinates.x || data.y !== game.coordinates.y) return
			game.updateCoordinates()
			player.socket.emit("success")
			enemy.socket.emit("partner-click")
			setTimeout(function () {
				game.sendCoordinates()
			}, 300)
		})

		super.start()
	}

	finish() {
		const {
			playerNumber,
			enemyNumber
		} = this

		this.status = playerNumber === enemyNumber
			? 'standoff'
			: enemyNumber < playerNumber ? 'win' : 'lose'

		super.finish()
	}
}

module.exports = Session;
