import { sign } from 'jsonwebtoken';

export const isDir = (value: string): boolean => !value.split('.')[1];
export const worldToPlural = (word: string):string => { // https://www.npmjs.com/package/pluralize can be used
  const lastLetter = word.slice(-1);
  if (lastLetter === 'y') return `${word.slice(0, -1)}ies`;
  return `${word}s`;
};
export const createToken = (userId: string) => {
  const userIdString = userId.toString();
  return sign(
    { userId: userIdString },
    process.env.TOKEN_SECRET,
    { expiresIn: '7d' },
  );
};
