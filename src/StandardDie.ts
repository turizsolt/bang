import { Face } from './Face';
import { Die } from './Die';

export class StandardDie implements Die {
  private faces: Face[];
  private topFace: Face;
  constructor() {
    this.faces = [
      Face.BullsEye1,
      Face.BullsEye2,
      Face.Beer,
      Face.Arrow,
      Face.Gatling,
      Face.Dynamite
    ];
    this.topFace = Face.Arrow;
  }
  roll() {
    let result = Math.floor(Math.random() * 6);
    this.topFace = this.faces[result];
  }
  getFace() {
    return this.topFace;
  }
  setFace(face: Face) {
    this.topFace = face;
  }
}
