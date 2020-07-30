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
    "games",
    {
      id: "string",
      state: "string",
      winner: "string",
      value: "string",
    },
    callback
  );

  db.createTable(
    "players",
    {
      id: "string",
      state: "string",
    },
    callback
  );

  db.createTable(
    "rooms",
    {
      id: { type: "int", primaryKey: true, autoIncrement: true },
      player_id: "string",
      game_id: "string",
    },
    callback
  );
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
