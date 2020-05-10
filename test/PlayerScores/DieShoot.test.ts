import { expect } from 'chai';
import { Role } from '../../src/Role';
import { Ability } from '../../src/Ability';
import { ScoreStore } from '../../src/ScoreStore';

describe('Player scores - Shoot', () => {
  it('shoot', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);

    scoreStore.shoot(0, 1, 1);

    const scores = scoreStore.getScores();
    expect(scores[1].lives).equals(7);
  });
});
