import { Face } from "./Face";

export class Die {
    private faces: Face[];
    private topFace: Face;
    constructor() {
        this.faces = [Face.BullsEye1, Face.BullsEye2, Face.Beer, Face.Arrow, Face.Gatling, Face.Dynamite];
        this.topFace = Face.Arrow;
    }
    roll() {
        let result = Math.floor(Math.random()*5);
        this.topFace = this.faces[result];
    }
    getFace() {
        return this.topFace;
    }
    setFace(face: Face) {
        this.topFace = face;
    }
}