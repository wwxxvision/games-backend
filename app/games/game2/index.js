const Game = require("../game")

class Game2 extends Game {

	setInitValues() {
		this.coordinates = this.getRandomCoordinates()
	}

	onGameStart() {
		this.sendCoordinates()
	}

	updateCoordinates() {
		this.coordinates = this.getRandomCoordinates()
	}

	sendCoordinates() {
		const {
			coordinates,
			roomName,
			io
		} = this
		io.to(roomName).emit('new-icon', coordinates)
	}

	getRandomCoordinates() {
		const { getRandomIntInclusive } = this
		return {
			x: getRandomIntInclusive(0, 70),
			y: getRandomIntInclusive(0, 70)
		}
	}

	getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}

module.exports = Game2;
