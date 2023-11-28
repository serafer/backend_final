import { Router } from "express";
const router = Router ()


import cartRouter from './cartRoutes.js';
import productRouter from './productRoutes.js';
import userRouter from './userRoutes.js';
import smsRouter from './smsRoutes.js';
import loggerRouter from './loggerRoutes.js';

router.use('/products', productRouter);
router.use('/cart', cartRouter);
router.use('/users', userRouter);
router.use('/sms', smsRouter);
router.use('/loggers', loggerRouter);

export default router;