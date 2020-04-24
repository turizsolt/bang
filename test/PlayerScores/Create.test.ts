import { expect } from 'chai';
import { Role } from '../../src/Role';
import { Ability } from '../../src/Ability';
import { ScoreStore } from '../../src/ScoreStore';

describe('Player scores - Create', () => {
  it('creates none', () => {
    const scoreStore = new ScoreStore();
    const scores = scoreStore.getScores();

    const expectedScores = [];

    expect(scores).deep.equals(expectedScores);
  });

  it('creates one', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    const scores = scoreStore.getScores();

    const expectedScores = [
      {
        role: Role.Sheriff,
        isRoleHidden: false,
        ability: Ability.None,
        arrows: 0,
        maxLives: 10,
        lives: 10
      }
    ];

    expect(scores).deep.equals(expectedScores);
  });

  it('creates all roles', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Renegade, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Deputy, Ability.None);
    const scores = scoreStore.getScores();

    const expectedScores = [
      {
        role: Role.Sheriff,
        isRoleHidden: false,
        ability: Ability.None,
        arrows: 0,
        maxLives: 10,
        lives: 10
      },
      {
        role: Role.Outlaw,
        isRoleHidden: true,
        ability: Ability.None,
        arrows: 0,
        maxLives: 8,
        lives: 8
      },
      {
        role: Role.Renegade,
        isRoleHidden: true,
        ability: Ability.None,
        arrows: 0,
        maxLives: 8,
        lives: 8
      },
      {
        role: Role.Outlaw,
        isRoleHidden: true,
        ability: Ability.None,
        arrows: 0,
        maxLives: 8,
        lives: 8
      },
      {
        role: Role.Deputy,
        isRoleHidden: true,
        ability: Ability.None,
        arrows: 0,
        maxLives: 8,
        lives: 8
      }
    ];

    expect(scores).deep.equals(expectedScores);
  });
});
