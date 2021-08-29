export const formUser = ({
  name = 'username', email = 'username@gmail.com', role = 'user', password = 'Password1',
}): any => ({
  name, email, role, password,
});

export const formCompany = ({ name = 'companyName', link = 'https://company.com' }): any => ({
  name, link,
});
