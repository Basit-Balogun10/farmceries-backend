import { Router } from "express";
import accountRouter from "./account.js";
import authRouter from "./auth.js";
import orderRouter from "./order.js";
import paymentRouter from "./payment.js";
import productRouter from "./product.js";

const v1Router = Router();

v1Router.use('/accounts', accountRouter)
v1Router.use('/auth', authRouter)
v1Router.use('/orders', orderRouter)
v1Router.use('/payment', paymentRouter)
v1Router.use('/products', productRouter)

export default v1Router
