import mongoose, { Schema } from 'mongoose';
import { CartObject, CartBaseClass, ProductObject } from '../carts.interface';
import { MongoDB } from '../../../services/mongodb';

//MongoSchema
const cartSchema = new mongoose.Schema<CartObject>({
  userId: { type: String, required: true, unique: true },
  products: [{ _id: Schema.Types.ObjectId, amount: Number }],
  dateCreated: { type: Date, required: false },
  dateUpdated: { type: Date, required: false },
  deliveryAddress: { type: Object, required: false }
});

const dbCollection = 'carts';
export class PersistenciaMongo implements CartBaseClass {
  private carrito;

  constructor() {
    const mongo = new MongoDB();
    const server = mongo.getConnection();
    this.carrito = server.model<CartObject>(dbCollection, cartSchema);
  }

  // Exportar el modelo para usarlo en tests
  model(): any {
    return this.carrito;
  }

  async getCart(userId: string): Promise<CartObject> {
    const item = await this.carrito.findOne({ userId });
    if (!item) throw new Error('No existe el carrito');
    return item;
  }

  async createCart(userId: string, deliveryAddress: object): Promise<CartObject> {
    const newCart = new this.carrito({
      userId,
      products: [],
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
      deliveryAddress: deliveryAddress
    });
    await newCart.save();
    return newCart;
  }

  async add2Cart(cartId: string, product: ProductObject): Promise<CartObject> {
    const cart = await this.carrito.findById(cartId);
    if (!cart) throw new Error('Cart not found');
    const index = cart.products.findIndex((aProduct: any) => aProduct._id == product._id);
    if (index < 0) cart.products.push(product);
    else cart.products[index].amount += product.amount;
    cart.dateUpdated = Date.now() as any;
    await cart.save();
    return cart;
  }

  async deleteProduct(cartId: string, product: ProductObject): Promise<CartObject> {
    const cart = await this.carrito.findById(cartId);
    if (!cart) throw new Error('Cart not found');
    const index = cart.products.findIndex((aProduct) => aProduct._id == product._id);
    if (index < 0) throw new Error('Product not found');
    if (cart.products[index].amount < product.amount)
      throw new Error('Product amount is less than the amount to delete');
    if (cart.products[index].amount == product.amount) cart.products.splice(index, 1);
    else cart.products[index].amount -= product.amount;
    await cart.save();
    return cart;
  }

  async emptyCart(cartId: string): Promise<CartObject> {
    const cart = await this.carrito.findById(cartId);
    if (!cart) throw new Error('Cart not found');
    cart.products = [];
    await cart.save();
    return cart;
  }
}
