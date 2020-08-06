const DatabaseManager = require("../System/DatabaseManager");

class ConnectionModel {
	constructor(db) {
		this.db = new DatabaseManager(db);
	}

	async create({ player_id, socket_id }) {
		return this.db.insert(
			`INTO connections (player_id, socket_id) VALUES ('${player_id}', '${socket_id}')`
		);
	}

	async getWaitngBySocketId(socket_id) {
		return await this.db.select(`* FROM connections WHERE socket_id='${socket_id}' AND status='wait'`);
	}

	async updateByPlayerId(player_id, status) {
		return await this.db.update(
			`connections SET status = '${status}' WHERE player_id='${player_id}'`
		);
	}

	async updateBySocketId(socket_id, status) {
		return await this.db.update(
			`connections SET status = '${status}' WHERE socket_id='${socket_id}'`
		);
	}
}

module.exports = ConnectionModel;
