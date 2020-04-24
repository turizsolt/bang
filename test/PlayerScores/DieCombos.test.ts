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

  it("set player's arrows", () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.setArrows(0, 2);
    const scores = scoreStore.getScores();

    expect(scores[0].arrows).equals(2);
  });

  it('indians are coming', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Outlaw, Ability.None);
    scoreStore.addPlayer(Role.Renegade, Ability.None);

    let arrows = scoreStore.getArrowCount();
    expect(arrows).equals(9);

    scoreStore.setLives(0, 2);
    scoreStore.setArrows(0, 3);
    scoreStore.setLives(1, 4);
    scoreStore.setArrows(1, 3);
    scoreStore.setLives(2, 1);
    scoreStore.setArrows(2, 2);
    scoreStore.setLives(3, 0);
    scoreStore.setArrows(3, 0);

    arrows = scoreStore.getArrowCount();
    expect(arrows).equals(1);

    scoreStore.indians();

    arrows = scoreStore.getArrowCount();
    expect(arrows).equals(9);

    const scores = scoreStore.getScores();
    expect(scores[0].lives).equals(0);
    expect(scores[1].lives).equals(1);
    expect(scores[2].lives).equals(0);
    expect(scores[3].lives).equals(0);

    expect(scores[0].arrows).equals(0);
    expect(scores[1].arrows).equals(0);
    expect(scores[2].arrows).equals(0);
    expect(scores[3].arrows).equals(0);
  });

  it('arrow, without indians coming', () => {
    const scoreStore = new ScoreStore();
    scoreStore.addPlayer(Role.Sheriff, Ability.None);

    scoreStore.arrow(0);

    const arrows = scoreStore.getArrowCount();
    expect(arrows).equals(8);

    const scores = scoreStore.getScores();
    expect(scores[0].lives).equals(10);
    expect(scores[0].arrows).equals(1);
  });

  it('arrow, indians are coming', () => {
    const scoreStore = new ScoreStore();
    let calls = 0;
    const temp = scoreStore.indians;
    scoreStore.indians = () => {
      calls++;
      temp.call(scoreStore);
    };

    scoreStore.addPlayer(Role.Sheriff, Ability.None);
    scoreStore.setArrows(0, 8);

    scoreStore.arrow(0);

    const arrows = scoreStore.getArrowCount();
    expect(arrows).equals(9);
    expect(calls).equals(1);

    const scores = scoreStore.getScores();
    expect(scores[0].lives).equals(1);
    expect(scores[0].arrows).equals(0);

    scoreStore.indians = temp;
  });

});
