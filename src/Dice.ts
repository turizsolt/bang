import { StandardDie } from "./StandardDie";
import { Die } from "./Die";
import { Face } from "./Face";

export class Dice {
    private dice: Die[];
    private hasRolled: boolean;
    private isFixed: boolean[];
    private isUsed: boolean[];
    private remainingRolls: number;

    constructor() {
        this.dice = [];
        this.isFixed = [false,false,false,false,false];
        this.isUsed = [false,false,false,false,false];
        this.remainingRolls = 3;
        this.hasRolled = false;
    }
    start(withTheseDice: Die[]) {
        
        this.dice = withTheseDice;
        console.log(this.dice);
        for (let i = 0; i < this.getDiceCount(); i++) {
            this.isFixed[i] = false;
            this.isUsed[i] = false;
        }
        //this.isFixed = [false,false,false,false,false];
        this.remainingRolls = 3;
        this.hasRolled = false;
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
            this.hasRolled = true;
            this.remainingRolls--;
            let dynamiteCount: number = 0;
            for (let i = 0; i < this.getDiceCount(); i++) {
                console.log(i);
                if (!this.isFixed[i]) {
                    this.dice[i].roll();                    
                    console.log(i, this.dice[i].getFace());
                }
                if (this.dice[i].getFace() === Face.Dynamite) {
                    this.isFixed[i] = true;
                    dynamiteCount++;
                }
            }
            if (dynamiteCount > 2) {
                
                this.finished();
            }
        }
        if(this.remainingRolls === 0) {
            this.finished();
        }
    }
    finished() {
        if(!this.hasRolled) return;
        for (let i = 0; i < this.getDiceCount(); i++) {
            this.isFixed[i] = true;
        }
        this.remainingRolls = 0;
    }
    fixDie(dieId: number) {
        if(!this.hasRolled) return;
        console.log("im fixed");
        this.isFixed[dieId] = true;
    }
    unfixDie(dieId: number) {
        if(!this.hasRolled) return;
        if (this.dice[dieId].getFace() !== Face.Dynamite) {
            this.isFixed[dieId] = false;
        }
    }
    getDieFace(id: number): Face {
        return this.dice[id].getFace();
    }
}