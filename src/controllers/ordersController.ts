import { Request, Response } from 'express';
import { UserObject } from '../models/users/users.interface';
import { orderAPI } from '../apis/ordersAPI';
import { EmailService } from '../services/mailer';
import { Logger } from '../utils/logger';

class Orders {
  async getOrders(req: Request, res: Response) {
    try {
      const user: UserObject = req.user as UserObject;
      const userId = user._id;
      const order = await orderAPI.getOrders(userId);
      if (!order) res.status(400).json({ msg: `Order not found` });
      return res.json({ data: order });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }

  async getOrdersbyId(req: Request, res: Response) {
    try {
      Logger.debug(req.params);
      const orderId = req.params.orderId;
      Logger.debug(`Getting order ${orderId}`);
      const order = await orderAPI.getOrderById(orderId);
      if (!order) res.status(400).json({ msg: `Order not found` });
      const user: UserObject = req.user as UserObject;
      const userId = user._id;
      //! Revisar si el usuario es el dueño del pedido
      if (order.userId.toString() !== userId.toString()) return res.status(400).json({ msg: `Order not found` });
      return res.json({ data: order });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }

  async completeOrder(req: Request, res: Response) {
    try {
      const user: UserObject = req.user as UserObject;
      const userId = user._id;
      const orderId = req.body.orderId;
      const order = await orderAPI.getOrderById(orderId);
      Logger.debug(`Completing order ${orderId}`);
      if (!order) return res.status(400).json({ msg: `Order not found` });
      //! Revisar si el usuario es el dueño del pedido
      if (order.userId.toString() !== userId.toString()) return res.status(400).json({ msg: `Order not found` });
      const updatedOrder = await orderAPI.completeOrder(orderId);
      EmailService.sendEmail(user.email, 'Your Order was Completed', JSON.stringify(updatedOrder));
      return res.json({ data: updatedOrder });
    } catch (error: any) {
      return res.status(400).json({ msg: error.message });
    }
  }
}

export const ordersController = new Orders();
