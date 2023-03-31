import { Router } from 'express';
import { cartController } from '../controllers/cartsController';
import { authController } from '../controllers/authController';
import asyncHandler from 'express-async-handler';
import { productsController } from '../controllers/productsController';

const router = Router();

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Devuelve un carrito
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *     responses:
 *       201:
 *         description: get cart by userId
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  $ref: '#/components/schemas/CartData'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/400BadRequest'
 */
router.get('/', authController.checkUserAuth, asyncHandler(cartController.getCart as any));

/**
 * @swagger
 * /api/cart/add/:
 *   post:
 *     summary: Ingresa un producto al carrito
 *     tags:
 *       - Cart
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
 *             $ref: '#/components/schemas/NewCartInput'
 *     responses:
 *       201:
 *         description: Devuelve el carrito con el producto ingresado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  msg: 'creando productos'
 *                  $ref: '#/components/schemas/CartData'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.post(
  '/add/',
  authController.checkUserAuth,
  productsController.checkValidId,
  productsController.checkAndUpdateStock,
  asyncHandler(cartController.add2Cart as any)
);

/**
 * @swagger
 * /api/cart/delete:
 *   post:
 *     summary: Elimina un producto del carrito o actualiza la cantidad de productos
 *     tags:
 *       - Cart
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
 *             $ref: '#/components/schemas/NewCartInput'
 *     responses:
 *       201:
 *         description: Devuelve el carrito con el producto ingresado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items :
 *                  msg: 'creando productos'
 *                  $ref: '#/components/schemas/CartData'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.post(
  '/delete',
  authController.checkUserAuth,
  productsController.checkValidId,
  asyncHandler(cartController.deleteProducts as any)
);

/**
 * @swagger
 * /api/cart/submit:
 *   post:
 *     summary: Envia el carrito a la base de datos de ordenes de compra y lo vacia.
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *     responses:
 *       201:
 *         description: Devuelve la orden de compra creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ordersData'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.post('/submit', authController.checkUserAuth, asyncHandler(cartController.submitCart as any));

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     CartData:
 *       type: object
 *       properties:
 *         _id:
 *           type: String
 *           description: Product ID
 *           example: "614dfd26ea29ad3f194bad80"
 *         userId:
 *           type: String
 *           description: User ID
 *           example: "618d72256fc267b7222e8bce"
 *         products:
 *           type: Array
 *           description: List of products in the cart
 *           example: [{product: "614dfd26ea29ad3f194bad80", amount: 1}]
 *         dateCreated:
 *           type: String
 *           description: Date of creation
 *           example: "2019-12-12T12:12:12.000Z"
 *         dateUpdated:
 *           type: String
 *           description: Date of last update
 *           example: "2019-12-12T12:12:12.000Z"
 *         DeliveryAddress:
 *           type: Object
 *           description: Delivery address
 *           example: {
 *             street: "Av. Siempreviva",
 *             number: "456",
 *             floor: 0,
 *             apartment: "A",
 *             postalCode: "1425",
 *             city: "Springfield",
 *             state: "IL"
 *           }
 *     NewCartInput:
 *       type: object
 *       properties:
 *         product:
 *           type: String
 *           description: ID del producto
 *           example: "61b6871a6238063410299fc6"
 *         amount:
 *           type: Number
 *           description: Cantidad de productos
 *           example: 5
 */
