import { Face } from "./Face";

export interface Die {
    roll();
    getFace();
    setFace(face: Face);
}