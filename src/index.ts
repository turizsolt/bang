import { Setup } from "./Setup";

import express from 'express';
import * as http from 'http';
import SocketIO from 'socket.io';
import { Dice } from "./Dice";
import { StandardDie } from "./StandardDie";
import { ScoreStore } from "./ScoreStore";

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
const dice = new Dice(scoreStore);
const withTheseDice = [new StandardDie(), new StandardDie(), new StandardDie(), new StandardDie(), new StandardDie()];
dice.start(withTheseDice);
function emitGame() {
  console.log(dice);
  io.emit('game', {
    gameState: setup.getState(),
    users: setup.getUsers(),
    dice: dice,
    scoreStore: scoreStore
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
    setup.generateAllPlayers(scoreStore);
    emitGame();
  });

  socket.on('endGame', data => {
    console.log('endgmae');
    setup.endGame();
    emitGame();
  });

  socket.on('addPlayer', data => {
    console.log('new player');
    setup.addUser(data.name, "picture");
    emitGame();
  });

  socket.on('removePlayer', data => {

    setup.removeUser(data.name);
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
    setup.kick(data.name);
    console.log("kicked");
    emitGame();
  });

  socket.on('roll', data => {
    dice.roll();
    console.log("rolled");
    emitGame();
  });

  socket.on('reset', data => {
    dice.start(withTheseDice);
    console.log("reset");
    emitGame();
  });

  socket.on('fix', data => {
    if(dice.getFixedDice()[data.dieId]) {
      dice.unfixDie(data.dieId);
    } else {
      dice.fixDie(data.dieId);
    }

    console.log(data.dieId);
    emitGame();
  });

  socket.on('selectToUseDie', data => {
    console.log('stud');
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

  socket.on('finish', data => {
    dice.finished();
    console.log("finished");
    emitGame();
  });
});