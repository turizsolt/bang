import { expect } from 'chai';
import { StandardDie } from '../../src/StandardDie';
import { Face } from '../../src/Face';

describe('Die', () => {
  it('roll a die', () => {
    const die = new StandardDie();
    die.roll();
    const rolled = die.getFace(); 
    const options = [Face.BullsEye1, Face.BullsEye2, Face.Beer, Face.Arrow, Face.Gatling, Face.Dynamite];

    expect(options.includes(rolled)).equals(true);
  });

  it('set a die', () => {
    const die = new StandardDie();
    die.setFace(Face.Beer);
    const rolled = die.getFace();
    
    expect(rolled).equals(Face.Beer);
  });

});
