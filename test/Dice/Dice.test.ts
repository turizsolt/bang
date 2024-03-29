import { expect } from 'chai';
import { Dice } from '../../src/Dice';
import { StandardDie } from '../../src/StandardDie';
import { Face } from '../../src/Face';

const fiveStandardDice: StandardDie[] = Array(5).fill(new StandardDie());

describe('Dice', () => {
  it('start it', () => {
    const dice = new Dice();
    dice.start(fiveStandardDice);

    expect(dice.getRemainingRolls()).equals(3);
    expect(dice.getDiceCount()).equals(5);
    expect(dice.getFixedDice()).deep.equals([false, false, false, false, false]);
  });

  it('roll it', () => {
    const dice = new Dice();
    dice.start(fiveStandardDice);
    dice.roll();

    expect(dice.getRemainingRolls()).equals(2);
  });

  it('roll too much', () => {
    const dice = new Dice();
    dice.start(fiveStandardDice);
    dice.roll();
    dice.roll();
    dice.roll();
    dice.roll();
    dice.roll();

    expect(dice.getRemainingRolls()).equals(0);
  });

  it('roll and finished', () => {
    const dice = new Dice();
    dice.start(fiveStandardDice);
    dice.roll();
    dice.finished();

    expect(dice.getRemainingRolls()).equals(0);
  });

  it('roll and finished, and next player', () => {
    const dice = new Dice();
    dice.start(fiveStandardDice);
    dice.roll();
    dice.finished();
    dice.start(fiveStandardDice);

    expect(dice.getRemainingRolls()).equals(3);
  });

  it('fix and unfix the dice', () => {
    const dice = new Dice();
    dice.start(fiveStandardDice);
    dice.fixDie(1);
    dice.unfixDie(2);
    dice.unfixDie(2);

    expect(dice.getFixedDice()).deep.equals([false, true, false, false, false]);
  });

  it('roll dice', () => {
    const dice = new Dice();
    dice.start(fiveStandardDice);
    dice.roll();

    const expectedFaces = [Face.BullsEye1, Face.BullsEye2, Face.Beer, Face.Arrow, Face.Gatling, Face.Dynamite];
    expect(expectedFaces.includes(dice.getDieFace(0))).equals(true);
  });

});
