import Joi from 'joi';

const PASS_RE = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const addressJoiSchema = Joi.object({
  street: Joi.string().min(5).max(50).required(),
  number: Joi.number().integer().min(1).max(9999).required(),
  floor: Joi.number().integer().min(0).max(99),
  apartment: Joi.string().min(1).max(3),
  postalCode: Joi.string().min(4).max(10).required(),
  city: Joi.string().min(5).max(50).required(),
  state: Joi.string().min(2).max(35).required()
});

export const userJoiSchema = Joi.object({
  firstName: Joi.string().min(3).max(15).required(),
  lastName: Joi.string().min(4).max(20).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(5).max(20).required(),
  password: Joi.string().regex(PASS_RE).required(),
  address: addressJoiSchema,
  phone: Joi.string().min(5).max(15).required(),
  age: Joi.number().integer().min(3).max(110).required(),
  isAdmin: Joi.boolean()
});

export interface newUserObject {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: object;
  phone: string;
  age: number;
  isAdmin: boolean;
  timestamp: string;
}

export interface UserObject {
  _id?: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: object;
  phone: string;
  age: number;
  isAdmin: boolean;
  timestamp: string;
}

export interface UserQuery {
  username?: string;
  email?: string;
}

export interface UserBaseClass {
  login(data: newUserObject): Promise<UserObject>;
  signUp(data: newUserObject): Promise<UserObject>;
}
