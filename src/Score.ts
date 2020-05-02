import { Role } from './Role';
import { Ability } from './Ability';
import { User } from './Player';

export interface Score {
  role: Role;
  isRoleHidden: boolean;
  ability: Ability;
  arrows: number;
  maxLives: number;
  lives: number;
  player: User;
}
