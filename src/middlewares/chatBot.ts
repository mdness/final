import { productsAPI } from '../apis/productsAPI';
import { orderAPI } from '../apis/ordersAPI';
import { cartAPI } from '../apis/cartsAPI';
import { ProductObject } from '../models/products/products.interface';
import moment from 'moment';

export const chatBot = async (userId: string, chabotMessage: any) => {
  const message = chabotMessage.message.toString().toLowerCase();

  let newMessage = {
    UserId: userId,
    from: 'System',
    message: '',
    date: moment().format('DD/MM/YYYY HH:mm:ss')
  };

  if (message.toLowerCase().includes('stock')) {
    const products = productsAPI.getProducts();
    const stock = (await products).map((product: ProductObject) => {
      return `${product.name} - ${product.stock}`;
    });
    newMessage.message = `Stock: ${JSON.stringify(stock)}`;
    return newMessage;
  }

  if (message.toLowerCase().includes('order')) {
    const orders = orderAPI.getOrders(userId);
    const lastOrder = (await orders).pop();
    newMessage.message = `Ultima orden: ${JSON.stringify(lastOrder)}`;
    return newMessage;
  }

  if (message.toLowerCase().includes('cart')) {
    const cart = await cartAPI.getCart(userId);
    newMessage.message = `Carrito: ${JSON.stringify(cart)}`;
    return newMessage;
  }

  const getDefaultMessage = async () => {
    newMessage.message =
      '--------------------------------------------------------------------------------\n' +
      '| To get a proper response please enter one of the following options:          |\n' +
      '|     * Stock: To get a list of all our products stock                         |\n' +
      '|     * Order: To get your last order                                          |\n' +
      '|     * Cart: To get your current cart content                                 |\n' +
      '--------------------------------------------------------------------------------\n';
    return newMessage;
  };

  return await getDefaultMessage();
};
