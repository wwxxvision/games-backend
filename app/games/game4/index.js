const Game = require("../game");

class Game4 extends Game {

	MAX_QUESTIONS() {
		return 7;
	}

	allRoles() {
		return ["character", "guess"];
	}

	setInitValues() {
		const { players } = this;
		this.roles = {};
		for (const player of players) {
			this.roles[player.socket_id] = null;
		}
		this.character = null;
		this.name = null;
		this.questions = [];
	}

	freeCharacter() {
		const {
			roomName,
			io,
			character
		} = this;

		io.to(roomName).emit("character", character);
	}

	questionsLeft() {
		const {
			roomName,
			io,
			questions,
			MAX_QUESTIONS
		} = this;

		io.to(roomName).emit("questions-left", MAX_QUESTIONS() - questions.length);
	}

	setCharacter(character) {
		const { roomName, io } = this;

		this.character = character;
		io.to(roomName).emit("character-chosen");
	}

	setName(name) {
		this.name = name;
	}

	setQuestion(question) {
		this.questions.push({
			id: this.questions.length,
			question: question,
		});
	}

	setAnswer(answer) {
		let question = this.getLastQuestion()

		question.answer = answer;
	}

	setRandomRoles() {
		const { players } = this;
		const allRoles = this.allRoles();
		for (const player of players) {
			const role = this.getRandomRole(allRoles);
			this.roles[player.socket_id] = role;
			allRoles.splice(allRoles.indexOf(role), 1);
		}
		const {
			roomName,
			io
		} = this;

		io.to(roomName).emit("random-roles");
	}

	getLastQuestion() {
		return this.questions.find(
			(question) => question.id === this.questions.length - 1
		)
	}

	getRandomRole(roles) {
		return roles[Math.floor(Math.random() * roles.length)];
	}
}

module.exports = Game4;
