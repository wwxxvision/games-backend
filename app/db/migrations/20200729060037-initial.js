"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
	dbm = options.dbmigrate;
	type = dbm.dataType;
	seed = seedLink;
};

exports.up = function (db, callback) {

	db.createTable(
		"connections",
		{
			id: {
				type: 'int',
				unsigned: true,
				notNull: true,
				primaryKey: true,
				autoIncrement: true
			},
			status: {
				type: 'string',
				defaultValue: 'wait'
			},
			player_id: {
				type: 'int',
				unsigned: true,
				notNull: true
			},
			socket_id: {
				type: 'string',
				notNull: true
			},
		},
		callback
	);

	db.createTable(
		"games",
		{
			id: {
				type: 'int',
				unsigned: true,
				notNull: true,
				primaryKey: true,
				autoIncrement: true
			},
			game: {
				type: 'string',
				notNull: true
			},
			status: {
				type: 'string',
				defaultValue: 'wait'
			},
			first_connection_id: {
				type: 'int',
				unsigned: true,
				notNull: true,
				foreignKey: {
					name: 'games_first_connection_id_fk',
					table: 'connections',
					mapping: 'id'
				}
			},
			second_connection_id: {
				type: 'int',
				unsigned: true,
				notNull: true,
				foreignKey: {
					name: 'games_second_connection_id_fk',
					table: 'connections',
					mapping: 'id'
				}
			},
			winner_connection_id: {
				type: 'int',
				unsigned: true,
				notNull: true,
				foreignKey: {
					name: 'games_winner_connection_id_fk',
					table: 'connections',
					mapping: 'id'
				}
			},
			data: 'json',
		},
		callback
	);
};

exports.down = function (db, callback) {
	db.dropTable("connections", {}, callback);
	db.dropTable("games", {}, callback);
};

exports._meta = {
	version: 1,
};
