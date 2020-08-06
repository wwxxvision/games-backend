const Game = require("../game")
const Session = require("./session");

class Game1 extends Game {

	setInitValues() {
		this.serverNumber = this.getRandomIntInclusive(1, 1000)
	}

	initAndStartSession(self, player, enemy) {
		const { serverNumber } = this
		const session = new Session(self, player, enemy, serverNumber)
		session.start()
	}

	getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}

module.exports = Game1;
