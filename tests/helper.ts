export const formUser = (name?: String, email?: String, role?: String, password?: String): any => ({
  name: name || 'username',
  email: email || 'username@gmail.com',
  role: role || 'user',
  password: password || 'Password1',
});

export const formCompany = (name?: String, link?: String): any => ({
  name: name || 'companyName',
  link: link || 'https://company.com',
});
