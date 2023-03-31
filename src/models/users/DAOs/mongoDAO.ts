import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { newUserObject, UserObject, UserBaseClass } from '../users.interface';
import { Logger } from '../../../utils/logger';
import { MongoDB } from '../../../services/mongodb';
import moment from 'moment';

const Schema = mongoose.Schema;
const dbCollection = 'users';

const UserSchema = new Schema<UserObject>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: Object, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  isAdmin: { type: Boolean, required: false },
  timestamp: { type: String, required: true }
});

UserSchema.pre('save', async function (next) {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);

  this.password = hash;
  next();
});

export class PersistenciaMongo implements UserBaseClass {
  private users;

  constructor() {
    const mongo = new MongoDB();
    const server = mongo.getConnection();
    this.users = server.model<UserObject>(dbCollection, UserSchema);
  }

  model(): any {
    return this.users;
  }

  async query(query: any): Promise<UserObject> {
    const result = await this.users.find(query);
    return result[0];
  }

  async findUser(userId: string): Promise<UserObject> {
    const user = await this.users.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  async login(data: newUserObject): Promise<UserObject> {
    const finder = data.username;
    const user = await this.users.findOne({ finder });
    if (!user) throw new Error('User not found');
    return user;
  }

  async signUp(data: newUserObject): Promise<UserObject> {
    const addUser: UserObject = {
      username: data.username,
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phone: data.phone,
      age: data.age,
      //! ----------------------------------------------------------
      //! Por seguridad, no se permite el registro de administradores.
      //! ----------------------------------------------------------
      isAdmin: false,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    Logger.debug('PersistenciaMongo.signUp() ==> ' + JSON.stringify(addUser));
    const newUser = new this.users(addUser);
    await newUser.save();
    return newUser;
  }

  async validateUserPassword(dbPassword: string, password: string): Promise<boolean> {
    // Logger.debug('PersistenciaMongo.validateUserPassword()');
    const compare = await bcrypt.compare(password, dbPassword);
    if (!compare) return false;
    return true;
  }
}
