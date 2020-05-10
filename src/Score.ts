import { Role } from './Role';
import { Ability } from './Ability';
import { User } from './Player';
import { Face } from './Face';

export interface Score {
  role: Role;
  isRoleHidden: boolean;
  ability: Ability;
  arrows: number;
  maxLives: number;
  lives: number;
  player: User;
  gotDice: Face[];
}
