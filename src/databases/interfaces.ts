import { USER_ROLE } from '../config';

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: USER_ROLE
}
