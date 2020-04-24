import { Die } from "./Die";

export class Dice {
    private dice: Die[];
    private isFixed: boolean[];
    private remainingRolls: number;
    constructor() {
        this.dice = [new Die(), new Die(), new Die(), new Die(), new Die()];
        this.isFixed = [false,false,false,false,false];
        this.remainingRolls = 3;
    }
    start() {
        this.isFixed = [false,false,false,false,false];
        this.remainingRolls = 3;
    }
    getRemainingRolls() {
        return this.remainingRolls;
    }
    getDiceCount() {
        return 5;
    }
    getFixedDice() {
        return this.isFixed;
    }
    roll() {
        if (this.remainingRolls > 0) {
            this.remainingRolls--;
            for (let i = 0; i < this.getDiceCount(); i++) {
                this.dice[i].roll;
            }
            
        }
    }
    finished() {
        for (let i = 0; i < this.getDiceCount(); i++) {
            this.isFixed[i] = true;
        }
        this.remainingRolls = 0;
    }
    fixDie(dieId: number) {
        this.isFixed[dieId] = true;
    }
    unfixDie(dieId: number) {
        this.isFixed[dieId] = false;
    }
}