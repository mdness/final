import mongoose, { Schema } from 'mongoose';
import { OrderObject, OrderBaseClass } from '../orders.interface';
import { MongoDB } from '../../../services/mongodb';
import { Logger } from '../../../utils/logger';

//MongoSchema
const orderSchema = new mongoose.Schema<OrderObject>({
  userId: { type: Schema.Types.ObjectId, required: true },
  products: [{ _id: Schema.Types.ObjectId, amount: Number, price: Number }],
  status: { type: String, required: true },
  timestamp: { type: String, required: true },
  orderTotal: { type: Number, required: true }
});

const dbCollection = 'orders';

export class PersistenciaMongo implements OrderBaseClass {
  private orders;

  constructor() {
    const mongo = new MongoDB();
    const server = mongo.getConnection();
    this.orders = server.model<OrderObject>(dbCollection, orderSchema);
  }

  // Exportar el modelo para usarlo en tests
  model(): any {
    return this.orders;
  }

  async find(id: string): Promise<Boolean> {
    const item: any = await this.orders.findOne({ id });
    if (item == 0) return false;
    return true;
  }

  async getOrders(userId: string): Promise<OrderObject[]> {
    const item = await this.orders.find({ userId });
    if (!item) throw new Error('No existe orden del usuario');
    return item;
  }

  async getOrderById(id: string): Promise<OrderObject> {
    const item = await this.orders.findById(id);
    if (!item) throw new Error('No existe orden del usuario');
    return item;
  }

  async createOrder(
    userId: string,
    products: object[],
    status: string,
    timestamp: string,
    orderTotal: number
  ): Promise<OrderObject> {
    Logger.info('Creating order');
    Logger.info(JSON.stringify(products));
    const newOrder = new this.orders({ userId, products, status, timestamp, orderTotal });
    await newOrder.save();
    return newOrder;
  }

  async completeOrder(id: string): Promise<OrderObject> {
    const order = await this.orders.findById(id);
    if (!order) throw new Error('No existe orden del usuario');
    const completedOrder = await this.orders.findByIdAndUpdate(order._id, {
      status: 'Delivered'
    });
    return completedOrder;
  }
}
