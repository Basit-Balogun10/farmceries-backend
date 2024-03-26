import express from 'express';
import { createOrder, getOrders, updateOrder } from '../../handlers/order/index.js';
import { protect } from '../../middleware/authMiddleware.js';

const orderRouter = express.Router();

orderRouter.get('/', protect, getOrders);
orderRouter.post('/', protect, createOrder);
orderRouter.put('/:id', protect, updateOrder);

export default orderRouter;
