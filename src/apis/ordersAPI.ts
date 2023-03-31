import { PersistenceArgument } from '../config/arguments';
import { OrderObject } from '../models/orders/orders.interface';
import { OrderFactory, Persistencia } from '../models/orders/orders.factory';
import { cartAPI } from './cartsAPI';
import { productsAPI } from './productsAPI';
import { Logger } from '../utils/logger';

//Si hay un argumento de persistencia, lo uso, sino, uso el default.
const tipo = PersistenceArgument || Persistencia.Mongo;

class OrderAPIClass {
  private order;

  constructor() {
    this.order = OrderFactory.get(tipo);
  }

  async findOrder(orderId: string) {
    return await this.order.find(orderId);
  }

  async getOrders(userId: string): Promise<OrderObject[]> {
    return await this.order.getOrders(userId);
  }

  async getOrderById(id: string): Promise<OrderObject> {
    return await this.order.getOrderById(id);
  }

  async createOrder(userId: string): Promise<OrderObject> {
    const cart = await cartAPI.getCart(userId);
    Logger.debug(`Creating order for cart ${cart._id}`);
    if (!cart) throw new Error('Cart does not exist. Error creating order');
    const getPrice = async (product: any) =>
      await productsAPI.getProducts(product._id).then((product) => product[0].price);
    const products = await Promise.all(
      cart.products.map(async (product) => {
        const price = await getPrice(product);
        return {
          _id: product._id,
          amount: product.amount,
          price
        };
      })
    );
    const orderTotal = products.reduce((total, product) => total + product.price * product.amount, 0);
    const order = {
      userId: cart.userId,
      products: products,
      status: 'Generated',
      timestamp: Date.now().toString(),
      orderTotal: orderTotal
    };
    Logger.debug(`Products: ${JSON.stringify(order.products)}`);
    const newOrder = await this.order.createOrder(
      userId,
      order.products,
      order.status,
      order.timestamp,
      order.orderTotal
    );
    return newOrder;
  }

  async completeOrder(orderId: string): Promise<OrderObject> {
    const order = await this.order.getOrderById(orderId);
    if (!order) throw new Error('Order does not exist. Error completing order');
    if (order.status !== 'Generated') throw new Error('Order is not in generated status. Error completing order');
    const completedOrder = await this.order.completeOrder(orderId);
    completedOrder.status = 'Delivered'; // ! hago trampa para que se muestre bien en pantalla. Ya que en la persistencia se guarda sin problemas.
    return completedOrder;
  }
}

export const orderAPI = new OrderAPIClass();
