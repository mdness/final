import { Schema } from 'mongoose';
import Joi from 'joi';

export const OrderStateArray = ['Generated', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];

export const ordersJoiSchema = Joi.object({
  userId: Joi.string().min(20).max(2000).required(),
  products: Joi.array().min(1).max(2000).required(),
  status: Joi.string()
    .valid(...OrderStateArray)
    .required(),
  timestamp: Joi.date().required(),
  total: Joi.number().min(1).max(2000).required()
});

export type userReference = Schema.Types.ObjectId | string;

export interface newOrderObject {
  userId: userReference;
  products: object[];
  timestamp: string;
  status: string;
  orderTotal: number;
}
export interface OrderObject {
  _id?: string;
  userId: userReference;
  products: object[];
  timestamp: string;
  status: string;
  orderTotal: number;
}

export interface OrderBaseClass {
  getOrders(userId?: string): Promise<OrderObject[]>;
  createOrder(
    userId: string,
    products: object[],
    status: string,
    timestamp: string,
    orderTotal: number
  ): Promise<OrderObject>;
  completeOrder(_id: string): Promise<OrderObject>;
}
