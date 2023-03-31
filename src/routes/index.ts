import { Router } from 'express';
import authRouter from './routerJwtAuth';
import productsRouter from './routerProducts';
import imagesRouter from './routerProductImages';
import cartsRouter from './routerCarts';
import infoRouter from './routerInfo';
import ordersRouter from './routerOrders';
const router = Router();

router.use('/user', authRouter);
router.use('/products', productsRouter);
router.use('/images', imagesRouter);
router.use('/cart', cartsRouter);
router.use('/info', infoRouter);
router.use('/orders', ordersRouter);

export default router;
