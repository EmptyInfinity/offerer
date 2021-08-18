import { USER_ROLE, OFFER_NAME } from '../config';

export interface IUser {
  id?: any
  name: string
  email: string
  password?: string
  role: USER_ROLE
  company?: any | ICompany,
  offers: any | IOffer[]
}

export interface ICompany {
  id?: any
  name: string
  link?: URL
  workers: any | IUser[]
}

export interface IOffer {
  id?: any
  name: OFFER_NAME
  price: number
  description?: string
}

export interface ICompanyInvite {
  id?: any
  user: any | IUser
  company: any | ICompany
}
