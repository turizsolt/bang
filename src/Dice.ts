import { StandardDie } from "./StandardDie";
import { Die } from "./Die";
import { Face } from "./Face";
import { ScoreStore } from "./ScoreStore";

export class Dice {
    private dice: Die[];
    private hasRolled: boolean;
    private isFixed: boolean[];
    private isUsed: boolean[];
    private remainingRolls: number;
    private using: number;

    constructor(private scoreStore?:ScoreStore) {
        this.dice = [];
        this.isFixed = [false,false,false,false,false];
        this.isUsed = [false,false,false,false,false];
        this.remainingRolls = 3;
        this.hasRolled = false;
        this.using = -1;
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
            
            // 1. resolve arrows immediately after a single roll
            for (let i = 0; i < this.getDiceCount(); i++) {
                if(this.dice[i].getFace() === Face.Arrow){
                    this.scoreStore.arrow(this.scoreStore.getCurrent());
                }
            }
            
            // 2. resolve dynamites if there is three of them
            if (dynamiteCount > 2) {
                this.finished();
                this.scoreStore.dynamite(this.scoreStore.getCurrent());
                for (let i = 0; i < this.getDiceCount(); i++) {
                    if(this.dice[i].getFace() === Face.Dynamite){
                        this.isUsed[i] = true;
                    }
                }
            }
            
            // resolving after the last roll
            if(this.remainingRolls === 0) {
                this.finished();
            }
        }
    }
    finished() {
        if(!this.hasRolled) return;
        for (let i = 0; i < this.getDiceCount(); i++) {
            this.isFixed[i] = true;
        }
        this.remainingRolls = 0;

        // count gatlings
        var gatlingCount = 0;
        for (let i = 0; i < this.getDiceCount(); i++) {
            if(this.dice[i].getFace() === Face.Gatling){
                gatlingCount++;
            }
        }   

        // is there three gatling to take effect?
        if(gatlingCount > 2) {
            this.scoreStore.gatling(this.scoreStore.getCurrent());
        }

        // set arrows, dynamite and gatling dice to used, as they are used
        for (let i = 0; i < this.getDiceCount(); i++) {
            if(this.dice[i].getFace() === Face.Arrow || this.dice[i].getFace() === Face.Dynamite || this.dice[i].getFace() === Face.Gatling){
                this.isUsed[i] = true;
            }
        }    

        this.checkIfUsedAllTheDice();
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
    selectToUseDie(dieId: number) {
        if(this.remainingRolls !== 0) return;
        if(!this.isUsed[dieId]) {
            this.using = dieId;
        }
    }
    unselectToUseDie(dieId: number) {
        if(this.remainingRolls !== 0) return;
        if(!this.isUsed[dieId] && this.using === dieId) {
            this.using = -1;
        }
    }
    chooseTarget(playerId:number){
        if(this.using === -1) return;
        console.log('target');
        switch(this.dice[this.using].getFace()) {
            case Face.Beer:
                console.log('beer');
                this.scoreStore.beer(this.scoreStore.getCurrent(), playerId);
                break;
            
            case Face.BullsEye1:
            case Face.BullsEye2:
                this.scoreStore.shoot(this.scoreStore.getCurrent(), playerId);
                break;
        }
        this.isUsed[this.using] = true;
        this.using = -1;
        this.checkIfUsedAllTheDice();
    }
    getDieFace(id: number): Face {
        return this.dice[id].getFace();
    }

    checkIfUsedAllTheDice() {
        let unused = 0;
        for (let i = 0; i < this.getDiceCount(); i++) {
            if(this.isUsed[i] === false){
                unused++;
            }
        }  

        if(unused > 0) return;

        this.scoreStore.nextPlayer();
        this.start(this.dice);
    }
}