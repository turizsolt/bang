import { expect } from 'chai';
import { Setup } from '../../src/Setup';
import { ScoreStore } from '../../src/ScoreStore';
import { Dice } from '../../src/Dice';
import { Role } from '../../src/Role';
import { GameState } from '../../src/GameState';

describe('Setup - game', () => {
  it('game is started', () => {
    const setup = new Setup();
    expect(setup.getState()).equals(GameState.Lobby);
    setup.startGame();
    expect(setup.getState()).equals(GameState.Game);
  });

  it('game is ended', () => {
    const setup = new Setup();
    setup.startGame();
    expect(setup.getState()).equals(GameState.Game);
    setup.endGame();
    expect(setup.getState()).equals(GameState.Lobby);
  });

  // it('game starts properly', () => {
  //   const setup = new Setup();
  //   setup.startGame();

  //   const scoreStore:ScoreStore = setup.getScoreStore();
  //   const currentPlayerId = scoreStore.getCurrentPlayerId();
  //   expect(scoreStore.getRole(currentPlayerId)).equals(Role.Sheriff);

  //   const dice:Dice = setup.getDice();
  //   expect(dice.getRemainingRolls()).equals(3);
  // });

  // todo valahogyan el kell használni a kidobott kockákat
  // valahogyan át kell adni a következő játékosnak a vezérlést
});
