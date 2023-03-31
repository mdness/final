import { PersistenceArgument } from '../config/arguments';
import { newProductObject, ProductObject, ProductQuery } from '../models/products/products.interface';
import { ProductsFactory, Persistencia } from '../models/products/products.factory';

const tipo = PersistenceArgument || Persistencia.Mongo;

class prodAPI {
  private productos;

  constructor() {
    this.productos = ProductsFactory.get(tipo);
  }

  async getProducts(id: string | undefined = undefined): Promise<ProductObject[]> {
    if (id) return this.productos.get(id);
    else return this.productos.get();
  }

  async getProductsByCategory(category: string) {
    return await this.productos!.query({ category });
  }

  async addProduct(productData: newProductObject): Promise<ProductObject> {
    const newProduct = await this.productos!.add(productData);
    return newProduct;
  }

  async updateProduct(id: string, productData: newProductObject) {
    const updatedProduct = await this.productos!.update(id, productData);
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    await this.productos!.delete(id);
  }

  async query(options: ProductQuery) {
    return await this.productos!.query(options);
  }
}

export const productsAPI = new prodAPI();
