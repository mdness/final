import { Router } from 'express';
import { authController } from '../controllers/authController';
import { ordersController } from '../controllers/ordersController';
import asyncHandler from 'express-async-handler';

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Returns all orders
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *     responses:
 *       200:
 *         description: get all orders
 *         content:
 *           application/json:
 *             schema:
 *              type: array
 *              items :
 *                $ref: '#/components/schemas/ordersData'
 *       400:
 *         description: Error getting order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.get('/', authController.checkUserAuth, asyncHandler(ordersController.getOrders as any));

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Returns a order
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *           example: 61d332887aca803a53f9fb99
 *     responses:
 *       200:
 *         description: get order data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ordersData'
 *       400:
 *         description: Error getting order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.get('/:orderId', authController.checkUserAuth, asyncHandler(ordersController.getOrdersbyId as any));

/**
 * @swagger
 * /api/orders/complete:
 *   post:
 *     summary: Sets order as complete
 *     tags:
 *       - Orders
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
 *             type: object
 *             properties:
 *               orderId:
 *                type: string
 *                example: 61d332887aca803a53f9fb99
 *     responses:
 *       200:
 *         description: set order as complete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ordersData'
 *       400:
 *         description: Error getting order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/400BadRequest'
 */
router.post('/complete', authController.checkUserAuth, asyncHandler(ordersController.completeOrder as any));

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ordersData:
 *       type: object
 *       properties:
 *          _id:
 *           type: string
 *           description: Order ID
 *           example: 61d332887aca803a53f9fb99
 *          UserId:
 *            type: string
 *            description: User ID
 *            example: 61d332887aca803a53f9fb99
 *          products:
 *           type: array
 *           description: Array of products, quantities and prices
 *           example: [{ProductId: 12345, Quantity: 1, Price: 10.00}, {ProductId: 12345, Quantity: 1, Price: 10.00}]
 *          Timestamp:
 *           type: string
 *           description: Timestamp of order
 *           example: 2020-01-01T00:00:00.000Z
 *          status:
 *            type: string
 *            description: Status of order
 *            example: Delivered
 *          orderTotal:
 *            type: number
 *            description: Total price of order
 *            example: 10.00
 */
