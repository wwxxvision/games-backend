const ParentSession = require("../session");

class Session extends ParentSession {
  start() {
    const { player, enemy } = this;

    player.socket.on("player-click", function () {
      enemy.socket.emit("partner-click");
    });

    super.start();
  }

  finish() {
    const { playerNumber, enemyNumber } = this;

    this.status =
      playerNumber === enemyNumber || (!playerNumber && !enemyNumber)
        ? "standoff"
        : enemyNumber < playerNumber
        ? "win"
        : "lose";

    super.finish();
  }
}

module.exports = Session;
