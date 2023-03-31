import mongoose from 'mongoose';
import { newProductObject, ProductObject, ProductQuery, ProductBaseClass, categoryArray } from '../products.interface';
import moment from 'moment';
import faker from 'faker';
import { MongoDB } from '../../../services/mongodb';
import { Logger } from '../../../utils/logger';

//Defino y campos y tipos de los objetos en la db mongo.
const productsSchema = new mongoose.Schema<ProductObject>({
  timestamp: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: { type: Array, default: [], required: false }
});

// Define en que colección de la DB se va a escribir la data de productos.
const dbCollection = 'products';

// En caso que esté vacia la colección esta función agrega 50 mocks, para probar funcionalidades.
// Todo: sacar esto antes de ir a producción.
faker.locale = 'es_MX';
const mockData = () => {
  let aux = [];
  for (let i = 0; i < 50; i++) {
    aux.push({
      timestamp: moment().format(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: categoryArray[Math.floor(Math.random() * categoryArray.length)],
      price: faker.commerce.price(),
      stock: faker.datatype.number(100),
      images: [
        faker.image.image(),
        faker.image.fashion(),
        faker.image.cats(),
        faker.image.abstract(),
        faker.image.city(),
        faker.image.nature(),
        faker.image.business(),
        faker.image.food()
      ]
    });
  }
  return aux;
};

export class PersistenciaMongo implements ProductBaseClass {
  private products;

  constructor() {
    const mongo = new MongoDB();
    const server = mongo.getConnection();
    this.products = server.model<ProductObject>(dbCollection, productsSchema);

    // Todo: sacar esto antes de ir a producción
    this.products.count().then((count) => {
      if (count < 1) {
        Logger.warn('Insertando Data Mockup');
        this.products.insertMany(mockData());
      }
    });
  }

  // Exportar el modelo para usarlo en tests
  model(): any {
    return this.products;
  }

  async get(id?: string): Promise<ProductObject[]> {
    let output: ProductObject[] = [];
    try {
      if (id) {
        const item = await this.products.findById(id);
        if (item) output.push(item);
      } else output = await this.products.find();
      return output;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async add(data: newProductObject): Promise<ProductObject> {
    const newItem: ProductObject = {
      timestamp: moment().format(),
      name: data.name!,
      description: data.description,
      category: data.category,
      price: data.price,
      stock: data.stock,
      images: data.images
    };
    const newProduct = new this.products(newItem);
    await newProduct.save();
    return newProduct;
  }

  async update(id: string, data: newProductObject): Promise<ProductObject> {
    const updateItem: any = data;
    updateItem.timestamp = moment().format();
    return this.products.findByIdAndUpdate(id, updateItem).then(() => this.products.findById(id)) as any;
  }

  async delete(id: string) {
    await this.products.findByIdAndDelete(id);
  }

  async query(options: ProductQuery): Promise<ProductObject[]> {
    let query: ProductQuery = {};
    if (options.name) query.name = options.name;
    if (options.category) query.category = options.category;
    if (options.price) query.price = options.price;
    if (options.priceMax) query.price = { $lte: options.priceMax } as unknown as number;
    if (options.priceMin) query.price = { $gte: options.priceMin } as unknown as number;
    if (options.priceMin && options.priceMax)
      query.price = { $gte: Number(options.priceMin), $lte: Number(options.priceMax) } as unknown as number;
    if (options.stock) query.stock = options.stock;
    if (options.stockMax) query.stock = { $lte: options.stockMax } as unknown as number;
    if (options.stockMin) query.stock = { $gte: options.stockMin } as unknown as number;
    if (options.stockMin && options.stockMax)
      query.stock = { $gte: Number(options.stockMin), $lte: Number(options.stockMax) } as unknown as number;
    return this.products.find(query);
  }
}
