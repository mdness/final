import { Schema } from 'mongoose';

export type productReference = Schema.Types.ObjectId | string;
export interface CartObject {
  _id?: any;
  userId: string;
  products: ProductObject[];
  dateCreated?: Date;
  dateUpdated?: Date;
  deliveryAddress: object;
}

export interface ProductObject {
  _id: string;
  amount: number;
}

export interface CartBaseClass {
  getCart(userId?: string): Promise<CartObject>;
  createCart(userId: string, deliveryAddress: object): Promise<CartObject>;
  add2Cart(cartId: string, product: ProductObject): Promise<CartObject>;
  deleteProduct(cartId: string, product: ProductObject): Promise<CartObject>;
  emptyCart(cartId: string): Promise<CartObject>;
}
