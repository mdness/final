import { NextFunction, Request, Response } from 'express';
import { UserObject } from '../models/users/users.interface';
import { Logger } from '../utils/logger';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user: UserObject = req.user as UserObject;
  Logger.debug(`isAdmin: ${user.isAdmin}`);
  const admin = user.isAdmin || false;
  if (admin) next();
  else {
    res.status(401).json({
      msg: 'User has no admin rights'
    });
  }
};
