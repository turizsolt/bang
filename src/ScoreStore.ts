import { Role } from './Role';
import { Ability } from './Ability';
import { Score } from './Score';
import { User } from './Player';
import { abilityMaxLives } from './AbilityMaxLives';
import { Face } from './Face';

export const MAX_ARROWS = 9;

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
  getCurrent() {
    return this.current;
  }
  clearBeforeTurn() {
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].gotDice = [];
      this.players[i].livesBeforeTurn = this.players[i].lives;
    }
  }
  nextPlayer() {
    this.current++;
    if (this.current >= this.players.length) {
      this.current = 0;
    }
    if (this.players[this.current].lives <= 0) {
      this.nextPlayer();
    }
  }
  addPlayer(role: Role, ability: Ability, player?: User) {
    const newPlayer: Score = {
      role,
      isRoleHidden: role !== Role.Sheriff,
      ability: ability,
      arrows: 0,
      maxLives:
        role === Role.Sheriff
          ? abilityMaxLives[ability] + 2
          : abilityMaxLives[ability],
      lives:
        role === Role.Sheriff
          ? abilityMaxLives[ability] + 2
          : abilityMaxLives[ability],
      player: player,
      livesBeforeTurn: 0,
      gotDice: []
    };
    newPlayer.livesBeforeTurn = newPlayer.lives;
    this.players.push(newPlayer);
  }
  dynamite(currentPlayerId: number) {
    if (currentPlayerId < this.players.length) {
      this.setLives(currentPlayerId, this.players[currentPlayerId].lives - 1);
    }
    this.players[currentPlayerId].gotDice.push(Face.Dynamite);
  }
  beer(currentPlayerId: number, receivingPlayerId: number) {
    let currentLives = this.players[receivingPlayerId].lives;
    if (
      this.getCurrentAbility(currentPlayerId) === Ability.JesseJones &&
      currentPlayerId === receivingPlayerId &&
      currentLives <= 4
    ) {
      this.setLives(receivingPlayerId, currentLives + 2);
    } else if (currentLives != 0) {
      this.setLives(receivingPlayerId, currentLives + 1);
    }

    this.players[receivingPlayerId].gotDice.push(Face.Beer);
  }
  gatling(currentPlayerId: number) {
    for (let i = 0; i < this.players.length; i++) {
      if (
        i !== currentPlayerId &&
        this.getCurrentAbility(i) !== Ability.PaulRegret
      ) {
        this.setLives(i, this.players[i].lives - 1);
        this.players[i].gotDice.push(Face.Gatling);
      }
    }
    this.arrows = this.arrows + this.players[currentPlayerId].arrows;
    this.players[currentPlayerId].arrows = 0;
  }
  setLives(playerId: number, lives: number) {
    if (-1 < lives && lives <= this.players[playerId].maxLives) {
      this.players[playerId].lives = lives;
    }

    if (lives === 0) {
      this.justDied(playerId);
    }
  }
  getCurrentLives() {
    return this.players[this.current].lives;
  }
  justDied(playerId: number) {
    console.log('someone just died');

    // put their arrows back
    this.arrows += this.players[playerId].arrows;
    this.players[playerId].arrows = 0;

    this.players[playerId].isRoleHidden = false;

    this.whoWon();
    if (this.winner) return;
    for (let i = 0; i < this.players.length; i++) {
      if (
        this.players[i].lives > 0 &&
        this.getCurrentAbility(i) === Ability.VultureSam
      ) {
        this.setLives(i, this.players[i].lives + 2);
      }
    }
  }
  whoWon() {
    if (this.winner) return;

    let sheriff = 0;
    let deputy = 0;
    let outlaw = 0;
    let renegade = 0;
    console.log('checking winning conditions');
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].lives > 0) {
        switch (this.players[i].role) {
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
            break;
          }
          case Role.Renegade: {
            renegade++;
            break;
          }
        }
      }
    }
    if (renegade === 1 && sheriff + deputy + outlaw === 0) {
      this.winner = Role.Renegade;
      return;
    }
    if (outlaw + renegade === 0 && sheriff === 1) {
      this.winner = Role.Sheriff;
      return;
    }
    if (sheriff === 0) {
      this.winner = Role.Outlaw;
      return;
    }
  }
  gameEnd() {}
  setArrows(playerId: number, arrows: number) {
    this.arrows = this.arrows - arrows;
    this.players[playerId].arrows = arrows;
  }
  getArrowCount() {
    return this.arrows;
  }
  indians() {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].arrows > 0) {
        this.players[i].gotDice.push(Face.Indians);
      }
      if (this.players[i].lives > 0) {
        if (
          this.getCurrentAbility(i) === Ability.Jourdonnais &&
          this.players[i].arrows > 0
        ) {
          this.setLives(i, Math.max(0, this.players[i].lives - 1));
        } else {
          this.setLives(
            i,
            Math.max(0, this.players[i].lives - this.players[i].arrows)
          );
        }
        this.players[i].arrows = 0;
      }
    }
    this.arrows = MAX_ARROWS;
  }
  arrow(currentPlayerId) {
    if (this.getCurrentLives() <= 0) return;
    this.players[currentPlayerId].arrows++;
    this.arrows--;
    this.players[currentPlayerId].gotDice.push(Face.Arrow);
    if (this.arrows < 1) {
      this.indians();
    }
  }
  brokenArrow(currentPlayerId: number, receivingPlayerId: number) {
    this.players[receivingPlayerId].gotDice.push(Face.BrokenArrow);
    if (this.players[receivingPlayerId].arrows === 0) return;
    this.players[receivingPlayerId].arrows--;
    this.arrows++;
  }
  shoot(currentPlayerId: number, receivingPlayerId: number, distance: number) {
    this.setLives(receivingPlayerId, this.players[receivingPlayerId].lives - 1);
    this.players[receivingPlayerId].gotDice.push(
      distance === 1 ? Face.BullsEye1 : Face.BullsEye2
    );
  }
  isDistance(onePlayerId: number, otherPlayerId: number, dist: number) {
    // left
    let count = 0;
    let pos = onePlayerId;
    while (pos !== otherPlayerId) {
      pos++;
      if (pos === this.players.length) {
        pos = 0;
      }
      if (this.players[pos].lives > 0) {
        count++;
      }
    }
    if (count === dist) {
      return true;
    }
    // right
    let countR = 0;
    pos = onePlayerId;
    while (pos !== otherPlayerId) {
      if (pos === 0) {
        pos = this.players.length;
      }
      pos--;
      if (this.players[pos].lives > 0) {
        countR++;
      }
    }
    if (countR === dist) {
      return true;
    }

    if (count === 1 && countR === 1) {
      return true;
    }

    return false;
  }
  getCurrentAbility(currentPlayerId: number): Ability {
    return this.players[currentPlayerId].ability;
  }
}
