import Config from '../config';
import { UserObject } from '../models/users/users.interface';
import { authAPI } from '../apis/userAPI';
import { Logger } from '../utils/logger';

const jwt = require('jsonwebtoken');

type TokenPayload = { userId: string; userName: String; email: String; admin: boolean };

export const generateAuthToken = async (user: UserObject): Promise<string> => {
  const payload: TokenPayload = { userId: user._id, userName: user.username, email: user.email, admin: user.isAdmin };
  const token = await jwt.sign(payload, Config.JWT_SECRET_KEY, { expiresIn: Config.TOKEN_KEEP_ALIVE });
  return token;
};

export const checkAuth = async (token: any) => {
  try {
    const decode: TokenPayload = await jwt.verify(token, Config.JWT_SECRET_KEY);
    const user = await authAPI.findUser(decode.userId);
    return user;
  } catch (err) {
    Logger.error(err);
    return false;
  }
};
