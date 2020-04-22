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
    this.players[receivingPlayerId].lives++;
  }
  gatling(currentPlayerId: number) {
    for (let i = 0; i < this.players.length; i++) {
      if (i !== currentPlayerId) {
        this.players[i].lives--;
      }
    }
  }
}
