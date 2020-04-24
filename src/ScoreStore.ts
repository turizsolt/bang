import { Role } from './Role';
import { Ability } from './Ability';
import { Score } from './Score';

export class ScoreStore {
  private players: Score[];
  constructor() {
    this.players = [];
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
}
