import { Role } from './Role';
import { Ability } from './Ability';
import { Score } from './Score';

export const MAX_ARROWS = 9;

export class ScoreStore {
  private players: Score[];
  private arrows: number;
  constructor() {
    this.players = [];
    this.arrows = MAX_ARROWS;
  }
  getScores(): Score[] {
    return this.players;
  }
  addPlayer(role: Role, ability: Ability) {
    const newPlayer: Score = {
      role,
      isRoleHidden: role !== Role.Sheriff,
      ability,
      arrows: 0,
      maxLives: role === Role.Sheriff ? 10 : 8,
      lives: role === Role.Sheriff ? 10 : 8
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
}
