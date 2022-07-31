import { ICompany, IUser } from '../src/databases/interfaces';

export const formUser = ({
  name = 'username',
  email = 'username@gmail.com',
  password = 'Password1',
}) => ({
  name,
  email,
  password,
});

export const formCompany = ({
  name = 'companyName',
  link = 'https://company.com',
}) => ({
  name,
  link,
});
