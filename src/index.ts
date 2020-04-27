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

io.on('connection', socket => {
  socket.on('startGame', data => {
    console.log('startgmae');
    setup.startGame();
    io.emit('game', setup.getState());
  });

  socket.on('endGame', data => {
    console.log('endgmae');
    setup.endGame();
    io.emit('game', setup.getState());
  });

});