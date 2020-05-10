import { Setup } from './Setup';

import express from 'express';
import * as http from 'http';
import SocketIO from 'socket.io';
import { Dice } from './Dice';
import { StandardDie } from './StandardDie';
import { ScoreStore } from './ScoreStore';

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

app.use(express.static('public'));

const setup = new Setup();
var scoreStore = new ScoreStore();
export const dice = new Dice(scoreStore);
scoreStore.setDice(dice);
const withTheseDice = [
  new StandardDie(),
  new StandardDie(),
  new StandardDie(),
  new StandardDie(),
  new StandardDie()
];
dice.start(withTheseDice);
dice.prestart();
const emitGame = (): void => {
  io.emit('game', {
    gameState: setup.getState(),
    users: setup.getUsers(),
    dice: { ...dice, emitGame: null, scoreStore: null },
    scoreStore: { ...scoreStore, dice: null }
  });
};
dice.setUpdate(emitGame);

io.on('connection', socket => {
  socket.on('checkin', data => {
    emitGame();
  });

  socket.on('startGame', data => {
    dice.start();
    dice.prestart();
    setup.startGame();
    setup.generateAllPlayers(scoreStore);
    emitGame();
  });

  socket.on('endGame', data => {
    setup.endGame();
    emitGame();
  });

  socket.on('addPlayer', data => {
    setup.addUser(data.name, 'picture');
    emitGame();
  });

  socket.on('removePlayer', data => {
    setup.removeUser(data.name);
    emitGame();
  });

  socket.on('claimPlayer', data => {
    setup.claim(data.name, data.device, data.id);
    emitGame();
  });

  socket.on('unclaimPlayer', data => {
    setup.unclaim(data.name, data.device, data.id);
    emitGame();
  });

  socket.on('kickPlayer', data => {
    setup.kick(data.name);
    emitGame();
  });

  socket.on('roll', data => {
    dice.roll();
    emitGame();
  });

  socket.on('reset', data => {
    dice.start(withTheseDice);
    emitGame();
  });

  socket.on('fix', data => {
    if (dice.getFixedDice()[data.dieId]) {
      dice.unfixDie(data.dieId);
    } else {
      dice.fixDie(data.dieId);
    }

    emitGame();
  });

  socket.on('selectToUseDie', data => {
    dice.selectToUseDie(data.dieId);
    emitGame();
  });

  socket.on('unselectToUseDie', data => {
    dice.unselectToUseDie(data.dieId);
    emitGame();
  });

  socket.on('chooseTarget', data => {
    dice.chooseTarget(data.playerId);
    emitGame();
  });

  socket.on('startTurn', data => {
    dice.start();
    emitGame();
  });

  socket.on('finish', data => {
    dice.finished();
    emitGame();
  });

  socket.on('pedro', data => {
    console.log('pedro', data);
    dice.pedroRamirezResult(data.playerId, data.response);
    emitGame();
  });

  socket.on('bart', data => {
    console.log('bart', data);
    dice.bartCassidyResult(data.playerId, data.response);
    emitGame();
  });
});
