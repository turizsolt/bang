import { expect } from 'chai';
import { Role } from '../../src/Role';
import { Ability } from '../../src/Ability';
import { ScoreStore } from '../../src/ScoreStore';

describe('Player scores - DieCombos', () => {
  it('dynamite', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Renegade, Ability.None);
    let scores = scoreStore.getScores();
    expect(scores[1].lives).equals(8);

    scoreStore.dynamite(1);
    scores = scoreStore.getScores();
    expect(scores[1].lives).equals(7);
  });

  it('dynamite - non existing player', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.dynamite(1);
  });

  it('beer', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Renegade, Ability.None);
    scoreStore.setLives(1, 7);
    let scores = scoreStore.getScores();

    scoreStore.beer(1, 1);
    scores = scoreStore.getScores();
    expect(scores[1].lives).equals(8);
  });

  it('gatling', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Renegade, Ability.None);

    scoreStore.gatling(1);
    const scores = scoreStore.getScores();
    expect(scores[0].lives).equals(9);
    expect(scores[1].lives).equals(8);
    expect(scores[2].lives).equals(7);
    expect(scores[3].lives).equals(7);
  });

  it("set player's lives", () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.setLives(0, 2);
    const scores = scoreStore.getScores();

    expect(scores[0].lives).equals(2);
  });

  it('beer above max. lives', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.setLives(0, 10);
    scoreStore.beer(0, 0);
    const scores = scoreStore.getScores();

    expect(scores[0].lives).equals(10);
  });

  it('beer with dead players', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.setLives(0, 0);
    scoreStore.beer(0, 0);
    const scores = scoreStore.getScores();

    expect(scores[0].lives).equals(0);
  });

  it('gatling with dead players', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Renegade, Ability.None);
    scoreStore.setLives(2, 0);
    scoreStore.gatling(1);
    const scores = scoreStore.getScores();
    expect(scores[0].lives).equals(9);
    expect(scores[1].lives).equals(8);
    expect(scores[2].lives).equals(0);
    expect(scores[3].lives).equals(7);
  });
});
