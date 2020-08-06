const DatabaseManager = require("../System/DatabaseManager");

class GameModel {
	constructor(db) {
		this.db = new DatabaseManager(db);
	}

	async get(gameId) {
		const games = await this.db.select(`
			games.*, 
			fConn.status AS first_connection_status,
			sConn.status AS second_connection_status
			FROM games 
			JOIN connections AS fConn
			ON games.first_connection_id = fConn.id 
			JOIN connections AS sConn
			ON games.first_connection_id = sConn.id 
			WHERE games.id='${gameId}'
		`);
		return games.pop()
	}

	async create({
		game,
		firstConnection,
		secondConnection
	}) {
		return await this.db.insert(
			`INTO games (game, first_connection_id, second_connection_id) VALUES ('${game}', '${firstConnection}', '${secondConnection}')`
		);
	}

	async updateStatus(gameId, status) {
		return await this.db.update(
			`games SET status = '${status}' WHERE id='${gameId}'`
		);
	}

	async setWinner(gameId, connectionId) {
		return await this.db.update(
			`games SET winner_connection_id = '${connectionId}' WHERE id='${gameId}'`
		);
	}
}

module.exports = GameModel;
