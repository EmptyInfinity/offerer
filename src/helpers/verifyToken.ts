import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';
import { ForbiddenError, BadTokenError } from '../handlers/ApiError';
import Logger from '../handlers/Logger';
import { IUser } from '../databases/interfaces';


declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}
interface UserPayload {
  userId: string;
}

// eslint-disable-next-line consistent-return
export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token');
  if (!token) return next(new ForbiddenError());

  try {
    const { userId } = verify(token, process.env.TOKEN_SECRET) as UserPayload;
    const user = await UserService.getById(userId);
    if (!user) return next(new ForbiddenError());
    req.user = { ...user, id: userId }; // mongo-fix
    next();
  } catch (err) {
    console.log(err);
    Logger.error(err);
    return next(new BadTokenError());
  }
};
