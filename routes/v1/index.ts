import { Router } from "express";
import productRouter from "./product.js";
import paymentRouter from "./payment.js";
import orderRouter from "./order.js";

const v1Router = Router();

v1Router.use('/order', orderRouter)
v1Router.use('/product', productRouter)
v1Router.use('/payment', paymentRouter)

export default v1Router
