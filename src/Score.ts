import { Role } from './Role';
import { Ability } from './Ability';

export interface Score {
  role: Role;
  isRoleHidden: boolean;
  ability: Ability;
  arrows: number;
  lives: number;
}
