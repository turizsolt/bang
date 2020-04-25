import { expect } from 'chai';
import { StandardDie } from '../../src/StandardDie';
import { Face } from '../../src/Face';
import { RiggedDie } from '../../src/RiggedDie';

describe('RiggedDie', () => {
  it('roll a die', () => {
    const die = new RiggedDie([Face.Dynamite, Face.Beer]);
    die.roll();
    expect(die.getFace()).equals(Face.Dynamite);
    die.roll();
    expect(die.getFace()).equals(Face.Beer);
  });
});
