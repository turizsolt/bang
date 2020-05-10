import { Die } from './Die';
import { Face } from './Face';
import { ScoreStore } from './ScoreStore';
import { Ability } from './Ability';

export class Dice {
  private dice: Die[];
  private hasRolled: boolean;
  private isFixed: boolean[];
  private isUsed: boolean[];
  private remainingRolls: number;
  private maxRolls: number;
  private using: number;
  private currentOrder: number;
  private dieOrder: Face[][];
  private targetablePlayers: boolean[];
  private startable: boolean;

  constructor(private scoreStore?: ScoreStore) {
    this.dice = [];
    this.dieOrder = [
      [Face.Arrow],
      [Face.Dynamite],
      [Face.BullsEye1, Face.BullsEye2],
      [Face.Beer],
      [Face.Gatling],
      []
    ];
    this.isFixed = [false, false, false, false, false];
    this.isUsed = [false, false, false, false, false];
    this.targetablePlayers = [];
    this.maxRolls = 3;
    this.remainingRolls = this.maxRolls;
    this.hasRolled = false;
    this.using = -1;
    this.currentOrder = 0;
    this.startable = true;
  }
  prestart() {
    this.startable = true;
  }

  start(withTheseDice?: Die[]) {
    this.startable = false;
    if (withTheseDice) {
      this.dice = withTheseDice;
    }
    for (let i = 0; i < this.getDiceCount(); i++) {
      this.isFixed[i] = false;
      this.isUsed[i] = false;
      this.dice[i].setFace(Face.Empty);
    }
    this.maxRolls = 3;
    if (
      this.scoreStore.getCurrent() !== -1 &&
      this.scoreStore.getCurrentAbility(this.scoreStore.getCurrent()) ===
        Ability.LuckyDuke
    ) {
      this.maxRolls = 4;
    }
    this.scoreStore.clearBeforeTurn();
    this.remainingRolls = this.maxRolls;
    this.hasRolled = false;
    this.currentOrder = 0;
  }
  getRemainingRolls() {
    return this.remainingRolls;
  }
  getDiceCount() {
    return 5;
  }
  getFixedDice() {
    return this.isFixed;
  }
  roll() {
    if (this.remainingRolls > 0) {
      this.hasRolled = true;
      this.remainingRolls--;
      let dynamiteCount: number = 0;
      for (let i = 0; i < this.getDiceCount(); i++) {
        if (!this.isFixed[i]) {
          this.dice[i].roll();
          // 1. resolve arrows immediately after a single roll
          if (this.dice[i].getFace() === Face.Arrow) {
            this.scoreStore.arrow(this.scoreStore.getCurrent());
          }
        }
        if (this.dice[i].getFace() === Face.Dynamite) {
          if (
            this.scoreStore.getCurrentAbility(this.scoreStore.getCurrent()) !==
            Ability.BlackJack
          ) {
            this.isFixed[i] = true;
          }
          dynamiteCount++;
        }
      }

      // 2. resolve dynamites if there are three of them
      if (dynamiteCount > 2) {
        this.scoreStore.dynamite(this.scoreStore.getCurrent());
        for (let i = 0; i < this.getDiceCount(); i++) {
          if (this.dice[i].getFace() === Face.Dynamite) {
            this.isUsed[i] = true;
            this.isFixed[i] = true;
          }
        }
        this.finished();
        // resolving after the last roll
      } else if (
        this.remainingRolls === 0 ||
        this.scoreStore.getCurrentLives() <= 0
      ) {
        this.finished();
      }
    }
  }
  nextOrder() {
    let count = 0;
    const alloweds = this.dieOrder[this.currentOrder];
    for (let i = 0; i < this.getDiceCount(); i++) {
      if (!this.isUsed[i] && alloweds.includes(this.dice[i].getFace())) {
        count++;
      }
    }

    if (this.currentOrder === 4) {
      // count gatlings
      var gatlingCount = 0;
      var unusedGatlings = 0;
      var usedGatlings = 0;
      for (let i = 0; i < this.getDiceCount(); i++) {
        if (this.dice[i].getFace() === Face.Gatling) {
          gatlingCount++;
          if (this.isUsed[i]) {
            usedGatlings++;
          }
          if (
            this.scoreStore.getCurrentAbility(this.scoreStore.getCurrent()) !==
            Ability.KitCarlson
          ) {
            this.isUsed[i] = true;
          }
          if (!this.isUsed[i]) {
            unusedGatlings++;
          }
        }
      }

      // is there three gatling to take effect?
      if (
        gatlingCount > 2 ||
        (gatlingCount > 1 &&
          this.scoreStore.getCurrentAbility(this.scoreStore.getCurrent()) ===
            Ability.WillyTheKid)
      ) {
        if (usedGatlings === 0) {
          this.scoreStore.gatling(this.scoreStore.getCurrent());
        }
      }

      if (
        this.scoreStore.getCurrentAbility(this.scoreStore.getCurrent()) !==
          Ability.KitCarlson ||
        unusedGatlings === 0
      ) {
        this.currentOrder++;
        this.nextOrder();
      }
    } else if (count === 0 && this.currentOrder < 5) {
      this.currentOrder++;
      this.nextOrder();
    }
  }

  finished() {
    if (!this.hasRolled) return;
    for (let i = 0; i < this.getDiceCount(); i++) {
      this.isFixed[i] = true;
    }
    this.remainingRolls = 0;
    this.currentOrder = 2;
    this.nextOrder();

    // set arrows, dynamite and dice to used, as they are used
    for (let i = 0; i < this.getDiceCount(); i++) {
      if (
        this.dice[i].getFace() === Face.Arrow ||
        this.dice[i].getFace() === Face.Dynamite
      ) {
        this.isUsed[i] = true;
      }
    }

    this.checkIfUsedAllTheDice();
  }
  fixDie(dieId: number) {
    if (!this.hasRolled) return;
    this.isFixed[dieId] = true;
  }
  unfixDie(dieId: number) {
    if (!this.hasRolled) return;
    if (
      this.dice[dieId].getFace() !== Face.Dynamite ||
      this.scoreStore.getCurrentAbility(this.scoreStore.getCurrent()) ===
        Ability.BlackJack
    ) {
      this.isFixed[dieId] = false;
    }
  }
  selectToUseDie(dieId: number) {
    if (this.remainingRolls !== 0) return;
    const alloweds = this.dieOrder[this.currentOrder];
    if (!alloweds.includes(this.dice[dieId].getFace())) return;
    if (!this.isUsed[dieId]) {
      this.using = dieId;
    }

    this.targetablePlayers = [];
    const scores = this.scoreStore.getScores();
    for (let i = 0; i < scores.length; i++) {
      let targetable = true;
      if (
        i === this.scoreStore.getCurrent() &&
        [Face.BullsEye1, Face.BullsEye2].includes(
          this.dice[this.using].getFace()
        )
      ) {
        targetable = false;
      }
      if (scores[i].lives <= 0) {
        targetable = false;
      }
      if (
        this.scoreStore.getCurrentAbility(this.scoreStore.getCurrent()) ===
        Ability.CalamityJanet
      ) {
        if (
          !this.scoreStore.isDistance(i, this.scoreStore.getCurrent(), 1) &&
          !this.scoreStore.isDistance(i, this.scoreStore.getCurrent(), 2) &&
          [Face.BullsEye1, Face.BullsEye2].includes(
            this.dice[this.using].getFace()
          )
        ) {
          targetable = false;
        }
      } else if (
        this.scoreStore.getCurrentAbility(this.scoreStore.getCurrent()) ===
        Ability.RoseDoolan
      ) {
        if (
          !this.scoreStore.isDistance(i, this.scoreStore.getCurrent(), 1) &&
          !this.scoreStore.isDistance(i, this.scoreStore.getCurrent(), 2) &&
          [Face.BullsEye1].includes(this.dice[this.using].getFace())
        ) {
          targetable = false;
        }
        if (
          !this.scoreStore.isDistance(i, this.scoreStore.getCurrent(), 3) &&
          !this.scoreStore.isDistance(i, this.scoreStore.getCurrent(), 2) &&
          [Face.BullsEye2].includes(this.dice[this.using].getFace())
        ) {
          targetable = false;
        }
      } else {
        if (
          !this.scoreStore.isDistance(i, this.scoreStore.getCurrent(), 1) &&
          [Face.BullsEye1].includes(this.dice[this.using].getFace())
        ) {
          targetable = false;
        }
        if (
          !this.scoreStore.isDistance(i, this.scoreStore.getCurrent(), 2) &&
          [Face.BullsEye2].includes(this.dice[this.using].getFace())
        ) {
          targetable = false;
        }
      }
      this.targetablePlayers.push(targetable);
    }
  }
  unselectToUseDie(dieId: number) {
    if (this.remainingRolls !== 0) return;
    if (!this.isUsed[dieId] && this.using === dieId) {
      this.using = -1;
    }
  }
  chooseTarget(playerId: number) {
    if (this.using === -1) return;
    if (!this.targetablePlayers[playerId]) return;
    switch (this.dice[this.using].getFace()) {
      case Face.Beer:
        this.scoreStore.beer(this.scoreStore.getCurrent(), playerId);
        break;

      case Face.BullsEye1:
        this.scoreStore.shoot(this.scoreStore.getCurrent(), playerId, 1);
        break;

      case Face.BullsEye2:
        this.scoreStore.shoot(this.scoreStore.getCurrent(), playerId, 2);
        break;

      case Face.Gatling:
        this.scoreStore.brokenArrow(this.scoreStore.getCurrent(), playerId);
        break;
    }
    this.isUsed[this.using] = true;
    this.using = -1;
    this.nextOrder();
    this.checkIfUsedAllTheDice();
  }
  getDieFace(id: number): Face {
    return this.dice[id].getFace();
  }

  checkIfUsedAllTheDice() {
    let unused = 0;
    for (let i = 0; i < this.getDiceCount(); i++) {
      if (this.scoreStore.getCurrentLives() <= 0) {
        this.isUsed[i] = true;
      }
      if (this.isUsed[i] === false) {
        unused++;
      }
    }

    if (unused > 0) return;

    this.scoreStore.nextPlayer();
    this.prestart();
  }
}
