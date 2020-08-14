var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var gameRender = require('./index');

server.listen(3038);


io.on('connection', function (socket) {
	socket.join('test');
	socket.on('start-game-render', () => {
		gameRender(io, socket, 'test')
	})
})