import { User } from './Player';
import { Device } from './Device';
import { GameState } from './GameState';
import { ScoreStore } from './ScoreStore';
import { Ability } from './Ability';
import { Role } from './Role';

export class Setup {
  private users: User[];
  private gameState: GameState;

  constructor() {
    this.users = [];
    this.gameState = GameState.Lobby;
  }
  addUser(name: string, pic: string): void {
    let newUser: User = { name, pic };
    this.users.push(newUser);
  }
  removeUser(name: string): void {
    this.users = this.users.filter(x => x.name !== name);
  }
  getUserNames(): string[] {
    return this.users.map(x => x.name);
  }
  getUsers(): User[] {
    return this.users;
  }
  claim(name: string, deviceType: Device, deviceId: string): void {
    const user = this.users.find(x => x.name === name);
    if (!this.isClaimed(name, deviceType)) {
      user[deviceType] = deviceId;
    }
  }
  unclaim(name: string, deviceType: Device, deviceId: string): void {
    const user = this.users.find(x => x.name === name);
    user[deviceType] = undefined;
  }
  isClaimed(name: string, deviceType: Device): boolean {
    const user = this.users.find(x => x.name === name);
    return !!user[deviceType];
  }
  whoClaimed(name: string, deviceType: Device): string {
    const user = this.users.find(x => x.name === name);

    return user[deviceType];
  }
  kick(name: string): void {
    const user = this.users.find(x => x.name === name);
    user.desktop = undefined;
    user.mobile = undefined;
  }

  getState(): GameState {
    return this.gameState;
  }
  startGame(): void {
    this.gameState = GameState.Game;

    //shuffle player order
    //add players scoreboards
    //shuffle deck
    //add roles to scoreboards
  }
  endGame(): void {
    this.gameState = GameState.Lobby;
  }
  generateAllPlayers(scoreStore: ScoreStore) {
    let playerCount = this.users.length;
    this.users = this.shuffle<User>(this.users);
    let possibleRoles = [
      Role.Sheriff,
      Role.Outlaw,
      Role.Outlaw,
      Role.Renegade,
      Role.Deputy,
      Role.Outlaw,
      Role.Deputy,
      Role.Renegade,
      Role.Outlaw
    ];
    let possibleAbilities = [
      Ability.Jourdonnais,
      Ability.VultureSam,
      Ability.LuckyDuke,
      Ability.PaulRegret,
      Ability.BlackJack,
      Ability.CalamityJanet,
      Ability.RoseDoolan,
      // Ability.BartCassidy,
      Ability.PedroRamirez,
      Ability.ElGringo,
      Ability.SidKetchum,
      Ability.SuzyLafayette,
      Ability.KitCarlson,
      Ability.WillyTheKid
    ];
    possibleAbilities = this.shuffle<Ability>(possibleAbilities);
    let roles = possibleRoles.slice(0, playerCount);
    roles = this.shuffle<Role>(roles);
    scoreStore.clear();
    for (let i = 0; i < playerCount; i++) {
      scoreStore.addPlayer(roles[i], possibleAbilities[i], this.users[i]);
      if (roles[i] === Role.Sheriff) {
        scoreStore.setStartingPlayer(i);
      }
    }
  }
  shuffle<T>(arr: T[]): T[] {
    return arr
      .map((a: T) => [Math.random(), a])
      .sort((a: [number, T], b: [number, T]) => a[0] - b[0])
      .map((a: [number, T]) => a[1]);
  }
}
