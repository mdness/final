import { Request, Response, NextFunction } from 'express';
import { productsAPI } from '../apis/productsAPI';
import {
  ProductQuery,
  productsJoiSchema,
  productUpdateJoiSchema,
  categoryArray
} from '../models/products/products.interface';
import { Logger } from '../utils/logger';

class Product {
  async checkValidProduct(req: Request, res: Response, next: NextFunction) {
    const validation = await productsJoiSchema.validate(req.body);
    if (validation.error) {
      return res.status(400).json({
        msg: validation.error.details[0].message
      });
    }
    next();
  }

  async checkValidUpdate(req: Request, res: Response, next: NextFunction) {
    const validation = await productUpdateJoiSchema.validate(req.body);
    if (validation.error) {
      return res.status(400).json({
        msg: validation.error.details[0].message
      });
    }
    next();
  }

  async checkValidId(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const productId = req.body.product;
    if (!id && !productId) {
      return res.status(400).json({
        msg: 'missing parameters'
      });
    }
    const producto = await productsAPI.getProducts(id);
    if (producto.length < 1) {
      return res.status(404).json({
        msg: 'Invalid Id'
      });
    }
    next();
  }

  async checkAndUpdateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { product, amount } = req.body;
      if (typeof Number(amount) !== 'number') {
        return res.status(400).json({
          msg: 'invalid amount'
        });
      }
      const dbProduct = await productsAPI.getProducts(product);
      if (dbProduct.length < 1) {
        return res.status(404).json({ msg: 'product not found' });
      }
      if (dbProduct[0].stock < amount) {
        return res.status(400).json({
          msg: 'not enough stock'
        });
      }
      Logger.debug(`Updating stock for product ${product} with amount ${amount}`);
      await productsAPI.updateProduct(product, { stock: dbProduct[0].stock - Number(amount) });
      next();
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  }

  async checkValidCategory(req: Request, res: Response, next: NextFunction) {
    const category = req.params.category;
    if (!category) {
      return res.status(400).json({
        msg: 'missing parameters'
      });
    }
    if (!categoryArray.includes(category)) {
      return res.status(400).json({
        msg: 'Invalid category'
      });
    }
    next();
  }

  async getProducts(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { name, description, category, price, stock, stockMin, stockMax, priceMin, priceMax } = req.query;
      if (id) {
        const producto = await productsAPI.getProducts(id);
        if (!producto) res.status(404).json({ msg: `product not found` });
        return res.json({ data: producto });
      }

      const query: ProductQuery = {};
      if (name) query.name = name.toString();
      if (description) query.description = description.toString();
      if (category) query.category = category.toString();
      if (price) query.price = Number(price);
      if (priceMin) query.priceMin = Number(priceMin);
      if (priceMax) query.priceMax = Number(priceMax);
      if (stock) query.stock = Number(stock);
      if (stockMin) query.stockMin = Number(stockMin);
      if (stockMax) query.stockMax = Number(stockMax);
      if (Object.keys(query).length) {
        return res.json({ data: await productsAPI.query(query) });
      }

      return res.json({ data: await productsAPI.getProducts() });
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  }

  async getProductsByCategory(req: Request, res: Response) {
    try {
      const category = req.params.category;
      const productos = await productsAPI.getProductsByCategory(category);
      if (productos.length < 1) {
        return res.status(404).json({ msg: `product not found` });
      }
      return res.json({ data: productos });
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  }

  async addProducts(req: Request, res: Response) {
    try {
      const newItem = await productsAPI.addProduct(req.body);
      return res.status(201).json({ msg: 'creando productos', data: newItem });
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  }

  async updateProducts(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updatedItem = await productsAPI.updateProduct(id, req.body);
      res.json({
        msg: 'actualizando productos',
        data: updatedItem
      });
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  }

  async deleteProducts(req: Request, res: Response) {
    try {
      const id = req.params.id;
      await productsAPI.deleteProduct(id);
      return res.status(200).json({
        msg: 'borrando productos'
      });
    } catch (error: any) {
      res.status(400).json({ msg: error.message });
    }
  }
}

export const productsController = new Product();
