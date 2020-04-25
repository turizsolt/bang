import { Face } from "./Face";
import { Die } from "./Die";

export class RiggedDie implements Die {
    private topFace: Face;
    private rollChain: Face[];
    private faceIndex: number;
    constructor(rollchain: Face[]) {
        this.rollChain = rollchain;
        this.topFace = Face.Arrow;
        this.faceIndex = 0;
    }
    roll() {
        console.log("itt");
        this.setFace(this.rollChain[this.faceIndex]);
        this.faceIndex++;
    }
    getFace() {
        return this.topFace;
    }
    setFace(face: Face) {
        this.topFace = face;
    }
}