import Joi from 'joi';

//todo: Feature improvement: import list of categories from table (out of this scope)
export const categoryArray = [
  'Almacén',
  'Bebidas',
  'Frescos',
  'Congelados',
  'Limpieza',
  'Perfumería',
  'Snacks',
  'Lácteos',
  'Fiambres',
  'Varios'
];

export const productsJoiSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().min(20).max(2000).required(),
  category: Joi.string()
    .valid(...categoryArray)
    .required(),
  price: Joi.number().required(),
  stock: Joi.number().min(1).max(2000).required(),
  images: Joi.array().min(1).max(10)
});

export const productUpdateJoiSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  description: Joi.string().min(20).max(2000),
  category: Joi.string().valid(...categoryArray),
  price: Joi.number(),
  stock: Joi.number().min(1).max(2000),
  images: Joi.array().min(1).max(10)
});

export interface newProductObject {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  stock?: number;
  images?: any;
}

export interface ProductObject {
  _id?: string;
  timestamp: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: any;
}
export interface ProductQuery {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  stock?: number;
  stockMin?: number;
  stockMax?: number;
  priceMin?: number;
  priceMax?: number;
}

export interface ProductBaseClass {
  get(id?: string | undefined): Promise<ProductObject[]>;
  add(data: newProductObject): Promise<ProductObject>;
  update(id: string, data: newProductObject): Promise<ProductObject>;
  delete(id: string): Promise<void>;
  query(options: ProductQuery): Promise<ProductObject[]>;
}
