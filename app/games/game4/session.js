const ParentSession = require("../session");

class Session extends ParentSession {
	start() {
		const { player, enemy } = this;

		player.socket.on("player-click", function (role) {
			enemy.socket.emit("partner-click", role);
		});

		const self = this;
		player.socket.on("pick-finish", function (role) {
			self.game.roles[player.socket_id] = role;
			if (self.game.roles[enemy.socket_id]) {
				self.pickFinish();
				self.afterPick();
			}
		});

		player.socket.on("result-role", function (role) {
			if (role === "guess") {
				self.guess();
			} else if (role === "character") {
				self.character();
			}
		});
	}

	pickFinish() {
		const { game, player, enemy } = this;

		const allRoles = game.allRoles();
		const [playerRole, enemyRole] = this.getRoles();

		if (playerRole === enemyRole) {
			game.setRandomRoles();
			return;
		}

		if (playerRole === "none") {
			allRoles.splice(allRoles.indexOf(enemyRole), 1);
			this.game.roles[player.socket_id] = allRoles.pop();
			return;
		}

		if (enemyRole === "none") {
			allRoles.splice(allRoles.indexOf(playerRole), 1);
			this.game.roles[enemy.socket_id] = allRoles.pop();
			return;
		}
	}

	afterPick() {
		const { game, player, enemy } = this;

		const [playerRole, enemyRole] = this.getRoles();
		player.socket.emit("result-role", playerRole);
		enemy.socket.emit("result-role", enemyRole);
		game.questionsLeft()
	}

	character() {
		const { player, enemy } = this;
		const self = this;

		player.socket.on("character-chosen", function (character) {
			if (!character) {
				self.playerLose();
				return;
			}
			self.game.setCharacter(character);
		});

		player.socket.on("answer", function (answer) {
			if (answer === null) {
				self.playerLose();
				return;
			}
			self.game.setAnswer(answer);
			self.nextOrName(enemy.socket, answer);
		});

		player.socket.on("finish", function (finish) {
			if (finish === null) {
				self.playerLose();
				return;
			}
			if (finish) self.playerLose('finish');
			else self.enemyLose('finish');
		});
	}

	guess() {
		const { player, enemy } = this;
		const self = this;

		player.socket.on("question", function (question) {
			self.game.setQuestion(question);
			if (!question) {
				enemy.socket.emit("question-skip");
				self.nextOrName(player.socket);
				return;
			}
			enemy.socket.emit("question", question);
		});

		player.socket.on("name", function (name) {
			if (!name) {
				self.playerLose();
				return;
			}
			self.game.setName(name);
			enemy.socket.emit("answer-guessing", name);
		});
	}

	nextOrName(socket, answer = null) {
		const { game } = this;
		if (game.questions.length < game.MAX_QUESTIONS()) {
			game.questionsLeft()
			socket.emit("next-question", game.getLastQuestion());
			return
		}
		socket.emit("name", game.questions);

	}

	playerLose(reason = 'timeout') {
		this.finish(false, reason)
	}

	enemyLose(reason = 'timeout') {
		this.finish(true, reason)
	}

	finish(playerWinner, reason) {
		const { game, player, enemy } = this;
		game.freeCharacter();

		this.game.onSessionFinish(player, playerWinner, enemy);
		player.socket.emit(playerWinner ? 'win' : 'lose', reason)
		this.game.onSessionFinish(enemy, !playerWinner, player);
		enemy.socket.emit(!playerWinner ? 'win' : 'lose', reason)
	}

	getRoles() {
		const { game, player, enemy } = this;

		return [game.roles[player.socket_id], game.roles[enemy.socket_id]];
	}
}

module.exports = Session;
