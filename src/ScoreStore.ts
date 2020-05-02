import { Role } from './Role';
import { Ability } from './Ability';
import { Score } from './Score';
import { User } from './Player';

export const MAX_ARROWS = 9;

export class ScoreStore {
  private players: Score[];
  private arrows: number;
  private current: number;
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
      maxLives: role === Role.Sheriff ? 10 : 8,
      lives: role === Role.Sheriff ? 10 : 8,
      player: player
    };
    this.players.push(newPlayer);
  }
  dynamite(currentPlayerId: number) {
    if (currentPlayerId < this.players.length) {
      this.players[currentPlayerId].lives--;
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
  }
  setLives(playerId: number, lives: number) {
    if (-1 < lives && lives <= this.players[playerId].maxLives) {
      this.players[playerId].lives = lives;
    }
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
        this.players[i].lives = this.players[i].lives - this.players[i].arrows;
        if (this.players[i].lives < 0) {
          this.players[i].lives = 0;
        };
        this.players[i].arrows = 0;
      }
    }
    this.arrows = MAX_ARROWS;
  }
  arrow(currentPlayerId) {
    this.players[currentPlayerId].arrows++;
    this.arrows--;
    if (this.arrows < 1) {
      this.indians();
    }
  }
  shoot(currentPlayerId: number, receivingPlayerId: number) {
    this.players[receivingPlayerId].lives--;
  }
  isDistance(onePlayerId: number, otherPlayerId: number, dist: number) {
    console.log('dist', onePlayerId, otherPlayerId, dist);
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
    console.log('poz', count);
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
    console.log('neg', countR);
    if(countR === dist) {
      return true;
    }

    if(count === 1 && countR === 1) {
      return true;
    } 
    console.log('false');

    return false;
  }
}
