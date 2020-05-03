import { Role } from './Role';
import { Ability } from './Ability';
import { Score } from './Score';
import { User } from './Player';
import { Dice } from './Dice';

export const MAX_ARROWS = 3;

export class ScoreStore {
  private players: Score[];
  private arrows: number;
  private current: number;
  private winner: Role;
  constructor() {
    this.clear();
  }
  getScores(): Score[] {
    return this.players;
  }
  clear() {
    this.players = [];
    this.arrows = MAX_ARROWS;
    this.current = -1;
    this.winner = undefined;
  }
  setStartingPlayer(index: number) {
    this.current = index;
  }
  getCurrent(){
    return this.current;
  }
  nextPlayer(){
    this.current++;
    if(this.current >= this.players.length) {
      this.current = 0;
    }
    if(this.players[this.current].lives <= 0) {
      this.nextPlayer();
    }
  }
  addPlayer(role: Role, ability: Ability, player?: User) {
    const newPlayer: Score = {
      role,
      isRoleHidden: role !== Role.Sheriff,
      ability,
      arrows: 0,
      maxLives: role === Role.Sheriff ? 3 : 1,
      lives: role === Role.Sheriff ? 3 : 1,
      player: player
    };
    this.players.push(newPlayer);
  }
  dynamite(currentPlayerId: number) {
    if (currentPlayerId < this.players.length) {
      this.setLives(currentPlayerId, this.players[currentPlayerId].lives - 1);
    }
  }
  beer(currentPlayerId: number, receivingPlayerId: number) {
    let currentLives = this.players[receivingPlayerId].lives;
    if (currentLives != 0) {
      this.setLives(receivingPlayerId, currentLives + 1);
    }
  }
  gatling(currentPlayerId: number) {
    for (let i = 0; i < this.players.length; i++) {
      if (i !== currentPlayerId) {
        this.setLives(i, this.players[i].lives - 1);
      }
    }
    this.arrows = this.arrows + this.players[currentPlayerId].arrows;
    this.players[currentPlayerId].arrows = 0;
  }
  setLives(playerId: number, lives: number) {
    if (-1 < lives && lives <= this.players[playerId].maxLives) {
      this.players[playerId].lives = lives;
    }

    if(lives === 0) {
      this.justDied(playerId);
    }
  }
  getCurrentLives(){
    return this.players[this.current].lives;
  }
  justDied(playerId: number) {
    console.log('someone just died');

    // put their arrows back
    this.arrows += this.players[playerId].arrows;
    this.players[playerId].arrows = 0;

    this.players[playerId].isRoleHidden = false;

    this.whoWon();
  }
  whoWon() {
    if(this.winner) return;

    let sheriff = 0;
    let deputy = 0;
    let outlaw = 0;
    let renegade = 0;
    console.log("checking winning conditions");
    for(let i = 0; i < this.players.length; i++) {
      if(this.players[i].lives > 0) {
        switch(this.players[i].role) {
          case Role.Sheriff: {
            sheriff++;
            break;
          }
          case Role.Deputy: {
            deputy++;
            break;
          }
          case Role.Outlaw: {          
            outlaw++;
            console.log(outlaw);
            break;
          }
          case Role.Renegade: {
            renegade++;
            break;
          }
        }
      }  
    }
    if(renegade === 1 && sheriff + deputy + outlaw === 0) {
      this.winner = Role.Renegade;
      return;
    };
    if(outlaw + renegade === 0 && sheriff === 1) { 
      this.winner = Role.Sheriff;
      return;
    };
    if(sheriff === 0) {
      this.winner = Role.Outlaw;
      return;
    }
  }
  gameEnd() {

  }
  setArrows(playerId: number, arrows: number) {
    this.arrows = this.arrows - arrows;
    this.players[playerId].arrows = arrows;    
  }
  getArrowCount() {
    return this.arrows;
  }
  indians() {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].lives > 0) {
        this.setLives(i, Math.max(0, this.players[i].lives - this.players[i].arrows));
        this.players[i].arrows = 0;
      }
    }
    this.arrows = MAX_ARROWS;
  }
  arrow(currentPlayerId) {
    if(this.getCurrentLives() <= 0) return;
    this.players[currentPlayerId].arrows++;
    this.arrows--;
    if (this.arrows < 1) {
      this.indians();
    }
  }
  shoot(currentPlayerId: number, receivingPlayerId: number) {
    this.setLives(receivingPlayerId, this.players[receivingPlayerId].lives-1);
  }
  isDistance(onePlayerId: number, otherPlayerId: number, dist: number) {
    // left
    let count = 0;
    let pos = onePlayerId;
    while(pos !== otherPlayerId) {
      pos++;
      if(pos === this.players.length) {
        pos = 0;
      }
      if(this.players[pos].lives > 0) {
        count++;
      }
    }
    if(count === dist) {
      return true;
    }
    // right
    let countR = 0;
    pos = onePlayerId;
    while(pos !== otherPlayerId) {
      if(pos === 0) {
        pos = this.players.length;
      }
      pos--;
      if(this.players[pos].lives > 0) {
        countR++;
      }
    }
    if(countR === dist) {
      return true;
    }

    if(count === 1 && countR === 1) {
      return true;
    } 
    
    return false;
  }
}
