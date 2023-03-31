import { PersistenceArgument } from '../config/arguments';
import { CartObject } from '../models/carts/carts.interface';
import { CartFactory, Persistencia } from '../models/carts/carts.factory';
import { Logger } from '../utils/logger';
import { authAPI } from './userAPI';

const tipo = PersistenceArgument || Persistencia.Mongo;
class cartAPIClass {
  private cart;

  constructor() {
    this.cart = CartFactory.get(tipo);
  }

  async getCart(userId: string): Promise<CartObject> {
    return await this.cart.getCart(userId);
  }

  async createCart(userId: string): Promise<CartObject> {
    const user = await authAPI.findUser(userId);
    const newCart = await this.cart.createCart(userId, user.address);
    return newCart;
  }

  async add2Cart(cartId: string, productId: string, amount: number): Promise<CartObject> {
    const newProduct = { _id: productId, amount: amount };
    const updatedCart = await this.cart.add2Cart(cartId, newProduct);
    return updatedCart;
  }

  async deleteProduct(cartId: string, productId: string, amount: number) {
    const oldProduct = { _id: productId, amount: amount };
    const updatedCart = await this.cart.deleteProduct(cartId, oldProduct);
    return updatedCart;
  }

  async emptyCart(cartId: string): Promise<CartObject> {
    const updatedCart = await this.cart.emptyCart(cartId);
    return updatedCart;
  }
}

export const cartAPI = new cartAPIClass();
