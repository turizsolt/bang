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
    private currentOrder: number;
    private dieOrder: Face[][];
    private targetablePlayers: boolean[];

    constructor(private scoreStore?:ScoreStore) {
        this.dice = [];
        this.dieOrder = [[Face.Arrow], [Face.Dynamite], [Face.BullsEye1, Face.BullsEye2], [Face.Beer], [Face.Gatling], []];
        this.isFixed = [false,false,false,false,false];
        this.isUsed = [false,false,false,false,false];
        this.targetablePlayers = [];
        this.remainingRolls = 3;
        this.hasRolled = false;
        this.using = -1;
        this.currentOrder = 0;
    }
    start(withTheseDice: Die[]) {
        
        this.dice = withTheseDice;
        console.log(this.dice);
        for (let i = 0; i < this.getDiceCount(); i++) {
            this.isFixed[i] = false;
            this.isUsed[i] = false;
            this.dice[i].setFace(Face.Empty);
        }
        //this.isFixed = [false,false,false,false,false];
        this.remainingRolls = 3;
        this.hasRolled = false;
        this.currentOrder = 0;
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
                    // 1. resolve arrows immediately after a single roll            
                    if(this.dice[i].getFace() === Face.Arrow){
                        this.scoreStore.arrow(this.scoreStore.getCurrent());
                    }
                    console.log(i, this.dice[i].getFace());
                }
                if (this.dice[i].getFace() === Face.Dynamite) {
                    this.isFixed[i] = true;
                    dynamiteCount++;
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
    nextOrder() {
        let count = 0;
        const alloweds = this.dieOrder[this.currentOrder];
        for (let i = 0; i < this.getDiceCount(); i++) {
            if(!this.isUsed[i] && alloweds.includes(this.dice[i].getFace())) {
                count++;
            }
        }
        console.log('next order count', count);

        if(this.currentOrder === 4) {
            console.log('resolving gatlings');
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

            this.currentOrder++;
            this.nextOrder();
        } else if(count === 0 && this.currentOrder<5) {
            console.log('next++');
            this.currentOrder++;
            this.nextOrder();
        }
    }

    finished() {
        if(!this.hasRolled) return;
        for (let i = 0; i < this.getDiceCount(); i++) {
            this.isFixed[i] = true;
        }
        this.remainingRolls = 0;
        this.currentOrder = 2;
        this.nextOrder();

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
        const alloweds = this.dieOrder[this.currentOrder];
        if(!alloweds.includes(this.dice[dieId].getFace()))return;
        if(!this.isUsed[dieId]) {
            this.using = dieId;
        }

        this.targetablePlayers = [];
        const scores = this.scoreStore.getScores();
        for(let i=0; i< scores.length;i++) {
            let targetable = true;
            if(i === this.scoreStore.getCurrent() && [Face.BullsEye1, Face.BullsEye2].includes(this.dice[this.using].getFace())) {
                targetable = false;
            }
            if(scores[i].lives <= 0) {
                targetable = false;
            }
            if(!this.scoreStore.isDistance(i,this.scoreStore.getCurrent(),1) && [Face.BullsEye1].includes(this.dice[this.using].getFace())) {
                targetable = false;
            }
            if(!this.scoreStore.isDistance(i,this.scoreStore.getCurrent(),2) && [Face.BullsEye2].includes(this.dice[this.using].getFace())) {
                targetable = false;
            }
            this.targetablePlayers.push(targetable);
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
        if(!this.targetablePlayers[playerId]) return;
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
        this.nextOrder();
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