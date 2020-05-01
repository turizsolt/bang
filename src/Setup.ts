import { Player } from "./Player";
import { Device } from "./Device";
import { GameState } from "./GameState";

export class Setup {
    private players: Player[];
    private gameState: GameState;
    constructor() {
        this.players = [];
        this.gameState = GameState.Lobby;
    }
    addPlayer(name: string, pic: string): void {
        let newPlayer: Player = {name, pic};
        this.players.push(newPlayer);
    }
    removePlayer(name: string):void {
        this.players = this.players.filter(x => x.name !== name);
    }
    getPlayerNames(): string[] {
        return this.players.map(x => x.name);
    }
    getPlayers(): Player[] {
        return this.players;
    }
    claim(name: string, deviceType: Device, deviceId: string): void {
        const player = this.players.find(x => x.name === name);
        if (!this.isClaimed(name, deviceType)) {
            player[deviceType] = deviceId;
        }
    }
    unclaim(name: string, deviceType: Device, deviceId: string): void {
        const player = this.players.find(x => x.name === name);
        player[deviceType] = undefined;
    }
    isClaimed(name: string, deviceType: Device): boolean {
        const player = this.players.find(x => x.name === name);
        return !!player[deviceType];
    }
    whoClaimed(name: string, deviceType: Device): string {
        const player = this.players.find(x => x.name === name);

        return player[deviceType];
    }
    kick(name: string): void {
        const player = this.players.find(x => x.name === name);
        player.desktop = undefined;
        player.mobile = undefined;
    }

    getState(): GameState {
        return this.gameState;
    }
    startGame(): void {
        this.gameState = GameState.Game;
    }
    endGame(): void {
        this.gameState = GameState.Lobby;
    }
}