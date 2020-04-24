import { expect } from 'chai';
import { Dice } from '../../src/Dice';

describe('Dice', () => {
  it('start it', () => {
    const dice = new Dice();
    dice.start();

    expect(dice.getRemainingRolls()).equals(3);
    expect(dice.getDiceCount()).equals(5);
    expect(dice.getFixedDice()).deep.equals([false, false, false, false, false]);
  });

  it('roll it', () => {
    const dice = new Dice();
    dice.start();
    dice.roll();

    expect(dice.getRemainingRolls()).equals(2);
  });

  it('roll too much', () => {
    const dice = new Dice();
    dice.start();
    dice.roll();
    dice.roll();
    dice.roll();
    dice.roll();
    dice.roll();

    expect(dice.getRemainingRolls()).equals(0);
  });

  it('roll and finished', () => {
    const dice = new Dice();
    dice.start();
    dice.roll();
    dice.finished();

    expect(dice.getRemainingRolls()).equals(0);
  });

  it('roll and finished, and next player', () => {
    const dice = new Dice();
    dice.start();
    dice.roll();
    dice.finished();
    dice.start();

    expect(dice.getRemainingRolls()).equals(3);
  });

  it('fix and unfix the dice', () => {
    const dice = new Dice();
    dice.start();
    dice.fixDie(1);
    dice.unfixDie(2);
    dice.unfixDie(2);

    expect(dice.getFixedDice()).deep.equals([false, true, false, false, false]);
  });

});
