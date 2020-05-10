import { Role } from './Role';
import { Ability } from './Ability';
import { Score } from './Score';
import { User } from './Player';
import { abilityMaxLives } from './AbilityMaxLives';
import { Face } from './Face';
import { Dice } from './Dice';

export const MAX_ARROWS = 9;

export class ScoreStore {
  private players: Score[];
  private arrows: number;
  private current: number;
  private winner: Role;
  private dice: Dice;

  constructor() {
    this.clear();
  }
  setDice(dice: Dice) {
    this.dice = dice;
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
      this.players[currentPlayerId].gotDice.push(Face.Dynamite);
      this.setLives(currentPlayerId, this.players[currentPlayerId].lives - 1);
      this.pedroRamirez(currentPlayerId);
    }
  }
  beer(currentPlayerId: number, receivingPlayerId: number) {
    this.players[receivingPlayerId].gotDice.push(Face.Beer);
    let currentLives = this.players[receivingPlayerId].lives;
    let startingLives = this.players[receivingPlayerId].livesBeforeTurn;
    if (
      this.getCurrentAbility(this.getCurrent()) === Ability.JesseJones &&
      currentPlayerId === receivingPlayerId &&
      startingLives <= 4
    ) {
      console.log('using jesse jones');
      //this.setLives(receivingPlayerId, currentLives + 2);
      //  } else if () {
    } else if (currentLives != 0) {
      this.setLives(receivingPlayerId, currentLives + 1);
    }
  }
  addLife(receivingPlayerId: number) {
    this.players[receivingPlayerId].gotDice.push(Face.AddLife);
    let currentLives = this.players[receivingPlayerId].lives;
    this.setLives(receivingPlayerId, currentLives + 1);
  }
  gatling(currentPlayerId: number) {
    for (let i = 0; i < this.players.length; i++) {
      if (
        i !== currentPlayerId &&
        this.getCurrentAbility(this.getCurrent()) !== Ability.PaulRegret
      ) {
        this.players[i].gotDice.push(Face.Gatling);
        if (!this.bartCassidy(i)) {
          this.setLives(i, this.players[i].lives - 1);
          if (
            this.players[i].ability === Ability.ElGringo &&
            !this.players[i].gotDice.includes(Face.BullsEye1) &&
            !this.players[i].gotDice.includes(Face.BullsEye2)
          ) {
            this.arrow(currentPlayerId);
          }

          this.pedroRamirez(i);
        }
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
  pedroRamirez(playerId) {
    if (
      this.getCurrentAbility(playerId) === Ability.PedroRamirez &&
      this.players[playerId].arrows > 0
    ) {
      this.dice.pedroRamirez(playerId);
    }
  }
  bartCassidy(playerId): boolean {
    if (
      this.getCurrentAbility(playerId) === Ability.BartCassidy &&
      this.arrows > 1
    ) {
      this.dice.bartCassidy(playerId);
      console.log('BC', true);
      return true;
    }
    console.log('BC', false);
    return false;
  }
  bartCassidyArrow(playerId) {
    this.arrow(playerId);
  }
  bartCassidyShoot(playerId) {
    this.setLives(playerId, this.players[playerId].lives - 1);
  }

  pedroRamirezOk(playerId) {
    this.brokenArrow(null, playerId);
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
        this.getCurrentAbility(this.getCurrent()) === Ability.VultureSam
      ) {
        this.setLives(i, this.players[i].lives + 2);
        this.players[i].gotDice.push(Face.AddTwoLives);
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
          this.getCurrentAbility(this.getCurrent()) === Ability.Jourdonnais &&
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
  arrow(currentPlayerId: number): void {
    if (this.getCurrentLives() <= 0) return;
    this.players[currentPlayerId].gotDice.push(Face.Arrow);
    this.players[currentPlayerId].arrows++;
    this.arrows--;
    if (this.arrows < 1) {
      this.indians();
    }
  }
  brokenArrow(currentPlayerId: number, receivingPlayerId: number) {
    console.log('recId', receivingPlayerId);
    if (receivingPlayerId === -1) return;
    this.players[receivingPlayerId].gotDice.push(Face.BrokenArrow);
    if (this.players[receivingPlayerId].arrows === 0) return;
    this.players[receivingPlayerId].arrows--;
    this.arrows++;
  }
  shoot(currentPlayerId: number, receivingPlayerId: number, distance: number) {
    this.players[receivingPlayerId].gotDice.push(
      distance === 1 ? Face.BullsEye1 : Face.BullsEye2
    );
    if (!this.bartCassidy(receivingPlayerId)) {
      this.setLives(
        receivingPlayerId,
        this.players[receivingPlayerId].lives - 1
      );
      if (
        this.players[receivingPlayerId].ability === Ability.ElGringo &&
        !this.players[receivingPlayerId].gotDice.includes(Face.BullsEye1) &&
        !this.players[receivingPlayerId].gotDice.includes(Face.BullsEye2)
      ) {
        this.arrow(currentPlayerId);
      }
      this.pedroRamirez(receivingPlayerId);
    }
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
  getCurrentAbility(playerId: number): Ability {
    return this.players[playerId].ability;
  }
  suzyLafayette(nOfShots: number): void {
    if (
      this.getCurrentAbility(this.getCurrent()) === Ability.SuzyLafayette &&
      nOfShots === 0 && this.getCurrentLives() > 0
    ) {
      this.setLives(this.getCurrent(), this.getCurrentLives() + 2);
      this.players[this.getCurrent()].gotDice.push(Face.AddTwoLives);
    }
  }
  slabTheKiller() {
    if (this.getCurrentAbility(this.getCurrent()) === Ability.SlabTheKiller) {
    }
  }
}
