import { expect } from 'chai';
import { Dice } from '../../src/Dice';
import { Face } from '../../src/Face';
import { Die } from '../../src/Die';
import { RiggedDie } from '../../src/RiggedDie';

describe('Dice', () => {
  it('dynamit is fixed by default', () => {
    const die0:Die = new RiggedDie([Face.Dynamite]);
    const die1:Die = new RiggedDie([Face.Beer]);
    const die2:Die = new RiggedDie([Face.Beer]);
    const die3:Die = new RiggedDie([Face.Dynamite]);
    const die4:Die = new RiggedDie([Face.Gatling]);
    const dice = new Dice();
    dice.start([die0, die1, die2, die3, die4]);
    dice.roll();

    expect(dice.getFixedDice()).deep.equals([true, false, false, true, false]);
  });

  it('dynamit is not rolled again', () => {
    const die0:Die = new RiggedDie([Face.Dynamite]);
    const die1:Die = new RiggedDie([Face.Beer, Face.BullsEye1]);
    const die2:Die = new RiggedDie([Face.Beer, Face.BullsEye2]);
    const die3:Die = new RiggedDie([Face.Dynamite]);
    const die4:Die = new RiggedDie([Face.Gatling, Face.Beer]);
    const dice = new Dice();
    dice.start([die0, die1, die2, die3, die4]);
    dice.roll();
    dice.roll();

    expect(dice.getFixedDice()).deep.equals([true, false, false, true, false]);
    expect(dice.getDieFace(0)).equals(Face.Dynamite);
    expect(dice.getDieFace(1)).equals(Face.BullsEye1);
  });

  it('dynamit is not rolled again when there are 3', () => {
    const die0:Die = new RiggedDie([Face.Dynamite]);
    const die1:Die = new RiggedDie([Face.Dynamite]);
    const die2:Die = new RiggedDie([Face.Beer]);
    const die3:Die = new RiggedDie([Face.Dynamite]);
    const die4:Die = new RiggedDie([Face.Gatling]);
    const dice = new Dice();
    dice.start([die0, die1, die2, die3, die4]);
    dice.roll();

    expect(dice.getFixedDice()).deep.equals([true, true, true, true, true]);
    expect(dice.getRemainingRolls()).equals(0);
  });

  it('fixed die is not rolled again', () => {
    const die0:Die = new RiggedDie([Face.Beer, Face.Gatling]);
    const die1:Die = new RiggedDie([Face.BullsEye1, Face.Gatling]);
    const die2:Die = new RiggedDie([Face.Beer, Face.Gatling]);
    const die3:Die = new RiggedDie([Face.BullsEye2, Face.Gatling]);
    const die4:Die = new RiggedDie([Face.Arrow, Face.Gatling]);
    const dice = new Dice();
    dice.start([die0, die1, die2, die3, die4]);
    dice.roll();
    dice.fixDie(2);
    dice.fixDie(3);
    dice.unfixDie(3);
    dice.roll();

    expect(dice.getDieFace(0)).equals(Face.Gatling);
    expect(dice.getDieFace(1)).equals(Face.Gatling);
    expect(dice.getDieFace(2)).equals(Face.Beer);
    expect(dice.getDieFace(3)).equals(Face.Gatling);
    expect(dice.getDieFace(4)).equals(Face.Gatling);
  });

  it('cannot unfix a dynamite', () => {
    const die0:Die = new RiggedDie([Face.Dynamite, Face.Gatling]);
    const die1:Die = new RiggedDie([Face.BullsEye1, Face.Gatling]);
    const die2:Die = new RiggedDie([Face.Beer, Face.Gatling]);
    const die3:Die = new RiggedDie([Face.BullsEye2, Face.Gatling]);
    const die4:Die = new RiggedDie([Face.Arrow, Face.Gatling]);
    const dice = new Dice();
    dice.start([die0, die1, die2, die3, die4]);
    dice.roll();
    dice.unfixDie(0);
    dice.roll();

    expect(dice.getDieFace(0)).equals(Face.Dynamite);
    expect(dice.getDieFace(1)).equals(Face.Gatling);
    expect(dice.getDieFace(2)).equals(Face.Gatling);
    expect(dice.getDieFace(3)).equals(Face.Gatling);
    expect(dice.getDieFace(4)).equals(Face.Gatling);
  });

  it('cannot roll after finished or useed all the rolls', () => {
    const die0:Die = new RiggedDie([Face.Arrow, Face.Gatling, Face.Beer]);
    const die1:Die = new RiggedDie([Face.BullsEye1, Face.Gatling, Face.Beer]);
    const die2:Die = new RiggedDie([Face.Arrow, Face.Gatling, Face.Beer]);
    const die3:Die = new RiggedDie([Face.BullsEye2, Face.Gatling, Face.Beer]);
    const die4:Die = new RiggedDie([Face.Arrow, Face.Gatling, Face.Beer]);
    const dice = new Dice();
    dice.start([die0, die1, die2, die3, die4]);
    dice.roll();
    dice.roll();
    dice.roll();
    dice.roll();
    dice.roll();

    expect(dice.getDieFace(0)).equals(Face.Beer);
    expect(dice.getDieFace(1)).equals(Face.Beer);
    expect(dice.getDieFace(2)).equals(Face.Beer);
    expect(dice.getDieFace(3)).equals(Face.Beer);
    expect(dice.getDieFace(4)).equals(Face.Beer);
  });
});
