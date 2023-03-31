import { Request, Response } from 'express';
import { productsAPI } from '../apis/productsAPI';
import { cartAPI } from '../apis/cartsAPI';
import { orderAPI } from '../apis/ordersAPI';
import { UserObject } from '../models/users/users.interface';
import { EmailService } from '../services/mailer';
import { Logger } from '../utils/logger';

class Cart {
  async getCart(req: Request, res: Response) {
    try {
      const user: UserObject = req.user as UserObject;
      const userId = user._id;
      const cart = await cartAPI.getCart(userId);
      if (!cart) res.status(401).json({ msg: `cart not found` });
      return res.status(201).json({ data: cart });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }

  async add2Cart(req: Request, res: Response) {
    try {
      const user: UserObject = req.user as UserObject;
      const userId = user._id;
      const cart = await cartAPI.getCart(userId);
      const cartId = cart._id;
      const { product, amount } = req.body;
      if (Number(amount) === NaN) return res.status(400).json({ msg: 'invalid parameters' });
      Logger.debug(`Adding product ${product} to cart ${cartId} with amount ${amount}`);
      const updatedCart = await cartAPI.add2Cart(cartId, product, Number(amount));
      return res.status(201).json(updatedCart);
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }

  async submitCart(req: Request, res: Response) {
    try {
      const user: UserObject = req.user as UserObject;
      const userId = user._id;
      const cart = await cartAPI.getCart(userId);
      const cartId = cart._id;
      Logger.debug(`Submitting cart ${cartId}`);
      const newOrder = await orderAPI.createOrder(userId);
      await cartAPI.emptyCart(cartId);
      EmailService.sendEmail(user.email, 'Order confirmation', JSON.stringify(newOrder));
      return res.status(201).json(newOrder);
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }

  async deleteProducts(req: Request, res: Response) {
    try {
      const user: UserObject = req.user as UserObject;
      const userId = user._id;
      const cart = await cartAPI.getCart(userId);
      const cartId = cart._id;
      const { product, amount } = req.body;
      const updatedCart = await cartAPI.deleteProduct(cartId, product, amount);
      const dbProduct = await productsAPI.getProducts(product);
      if (dbProduct.length === 0) {
        // Logeo error pero sigo aplicando el cambio
        Logger.error(`Product ${product} not found in products database`);
      } else {
        await productsAPI.updateProduct(product, { stock: dbProduct[0].stock + Number(amount) });
      }
      return res.status(201).json(updatedCart);
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }
}

export const cartController = new Cart();
