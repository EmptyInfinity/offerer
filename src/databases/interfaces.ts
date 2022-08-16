export interface IUser {
  id?: any
  name: string
  email?: string
  password?: string
  skills: string[]
  offers: string[]
  bio?: string
  isAdmin: boolean
}

export interface ICompany {
  id?: any
  name: string
  link?: URL
  description?: string
  employees: { isAdmin: boolean, user: any | IUser }[]
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
