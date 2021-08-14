import { sign } from 'jsonwebtoken';

export const isDir = (value: string): boolean => !value.split('.')[1];
export const worldToPlural = (word: string):string => { // https://www.npmjs.com/package/pluralize can be used
  if (word.slice(-1) === 'y') return `${word.slice(0, -1)}ies`;
  return `${word}s`;
};
export const createToken = (userId: string) => sign(
  userId,
  process.env.TOKEN_SECRET,
);
