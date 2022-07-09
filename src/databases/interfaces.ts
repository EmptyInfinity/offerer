import { USER_ROLE, USER_COMPANY_ROLE } from '../config';

export interface IUser {
  id?: any
  name: string
  email: string
  password?: string
  skills: string[]
  bio?: string
  role: USER_ROLE
}

export interface ICompany {
  id?: any
  name: string
  link?: URL
  description?: string
  workers: { role: USER_COMPANY_ROLE, user: any | IUser }[]
}

export interface IOffer {
  id?: any
  name: string
  salary: number
  description?: string
  company: any | ICompany
}

export interface IInvite {
  id?: any
  inviter: 'user' | 'company'
  offer: any | IOffer
  user: any | IUser
}
