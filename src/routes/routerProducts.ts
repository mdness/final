import { Router } from 'express';
import { productsController } from '../controllers/productsController';
import { authController } from '../controllers/authController';
import { isAdmin } from '../middlewares/isAdmin';
import asyncHandler from 'express-async-handler';

const router = Router();

/**
 * @swagger
 * /api/products/:
 *   get:
 *     summary: Retuns all products / products by query
 *     tags:
 *       - Products
 *     parameters:
 *       - name: name
 *         in: query
 *         description: name of the product
 *         required: false
 *         type: string
 *       - name: description
 *         in: query
 *         description: description of the product
 *         required: false
 *         type: string
 *       - name: category
 *         in: query
 *         description: category of the product
 *         required: false
 *         type: string
 *       - name: price
 *         in: query
 *         description: price of the product
 *         required: false
 *         type: number
 *       - name: priceMin
 *         in: query
 *         description: minimum price of the product
 *         required: false
 *         type: number
 *       - name: priceMax
 *         in: query
 *         description: maximum price of the product
 *         required: false
 *         type: number
 *       - name: stock
 *         in: query
 *         description: stock of the product
 *         required: false
 *         type: number
 *       - name: stockMin
 *         in: query
 *         description: minimum stock of the product
 *         required: false
 *         type: number
 *       - name: stockMax
 *         in: query
 *         description: maximum stock of the product
 *         required: false
 *         type: number
 *     responses:
 *       200:
 *         description: Returns array of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: Error getting products
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.get('/', asyncHandler(productsController.getProducts as any));

/**
 * @swagger
 * /api/products/{category}:
 *   get:
 *     summary: Returns all products by category
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           example: Bebidas
 *     responses:
 *       200:
 *         description: get product data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: Error getting product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.get(
  '/:category',
  productsController.checkValidCategory,
  asyncHandler(productsController.getProductsByCategory as any)
);

/**
 * @swagger
 * /api/products/:
 *   post:
 *     summary: Creates a new product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProductInput'
 *     responses:
 *       201:
 *         description: Returns created product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  msg: 'creando productos'
 *                  $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: "Falta ingresar alguno de los campos obligatorios: Nombre, Precio y Stock"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.post(
  '/',
  authController.checkUserAuth,
  isAdmin,
  productsController.checkValidProduct,
  asyncHandler(productsController.addProducts as any)
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Updates a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 61b6871a6238063410299fc5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProductInput'
 *     responses:
 *       200:
 *         description: Returns updated product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  msg: 'actualizando productos'
 *                  $ref: '#/components/schemas/ProductData'
 *       400:
 *         description: "Falta ingresar alguno de los campos obligatorios: Nombre, Precio y Stock"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.patch(
  '/:id?',
  authController.checkUserAuth,
  isAdmin,
  productsController.checkValidId,
  productsController.checkValidUpdate,
  asyncHandler(productsController.updateProducts)
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Deletes a product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 61b6871a6238063410299fd5
 *     responses:
 *       200:
 *         description: Returns confirmation message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                  type: string
 *                  example: 'Product deleted'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.delete(
  '/:id?',
  authController.checkUserAuth,
  isAdmin,
  productsController.checkValidId,
  asyncHandler(productsController.deleteProducts as any)
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductData:
 *       type: object
 *       properties:
 *         _id:
 *           type: String
 *           description: ID del producto
 *           example: "614dfd26ea29ad3f194bad80"
 *         timestamp:
 *           type: String
 *           description: Fecha de creación o modificación del producto
 *           example: "Apr 5 05:06:08"
 *         name:
 *           type: String
 *           description: Nombre del producto
 *           example: "Pampers"
 *         description:
 *           type: String
 *           description: Descripción del producto
 *           example: "Anoche cubrí, mis hijos dormidos, y el ruido del mar."
 *         category:
 *           type: String
 *           description: Categoría del producto
 *           example: "Almacén"
 *         images:
 *           type: Array
 *           description: Array de URLs de la imagen del producto
 *           example: ["https://picsum.photos/200", "https://picsum.photos/200"]
 *         price:
 *           type: number
 *           description: precio del producto
 *           example: 2000
 *         stock:
 *          type: number
 *          description: stock del producto
 *          example: 10
 *     NewProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: String
 *           description: Nombre del producto
 *           example: "Duff Beer"
 *         description:
 *           type: String
 *           description: Descripción del producto
 *           example: "Can of Duff Beer"
 *         category:
 *           type: String
 *           description: Categoría del producto
 *           example: "Drinks"
 *         images:
 *           type: Array
 *           description: Array de URLs de la imagen del producto
 *           example: ["https://picsum.photos/200", "https://picsum.photos/200"]
 *         price:
 *           type: number
 *           description: precio del producto
 *           example: 2
 *         stock:
 *          type: number
 *          description: stock del producto
 *          example: 10
 *     400BadRequest:
 *       type: object
 *       properties:
 *         message:
 *           type: String
 *           description: Error message
 *           example: "Bad Request"
 */
