import { Setup } from "./Setup";

import express from 'express';
import * as http from 'http';
import SocketIO from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(express.static('public'));

const setup = new Setup();
function emitGame() {
  io.emit('game', {
    gameState: setup.getState(),
    players: setup.getPlayers()
  })
}

io.on('connection', socket => {
  socket.on('checkin', data => {
    console.log("hajj");
    emitGame();
  });

  socket.on('startGame', data => {
    console.log('startgmae');
    setup.startGame();
    emitGame();
  });

  socket.on('endGame', data => {
    console.log('endgmae');
    setup.endGame();
    emitGame();
  });

  socket.on('addPlayer', data => {
    console.log('new player');
    setup.addPlayer(data.name, "picture");
    emitGame();
  });

  socket.on('removePlayer', data => {

    setup.removePlayer(data.name);
    emitGame();
  });

  socket.on('claimPlayer', data => {
    setup.claim(data.name, data.device, data.id);
    console.log(setup.whoClaimed(data.name,data.device));
    emitGame();
  });

  socket.on('unclaimPlayer', data => {
    setup.unclaim(data.name, data.device, data.id);
    console.log("unclaim");
    emitGame();
  });

  socket.on('kickPlayer', data => {
    setup.kick(data.name)
    console.log("kicked");
    emitGame();
  });
});