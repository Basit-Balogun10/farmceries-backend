import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import Order from '../../models/order.js';
import Product from '../../models/product.js';
import { OrderService } from '../../services/order.js';

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    res.status(400).json({ error: 'Invalid Request. Please provide userEmail' });
  }

  try {
    const orders = await OrderService.getOrders(userEmail as string);

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { userEmail, productId, pickupCoordinates, deliveryCoordinates } = req.body;

  // check if request body contains userEmail, pickupCoordinates and deliveryCoordinates
  if (!userEmail || !pickupCoordinates || !deliveryCoordinates || !productId) {
    res.status(400).json({ error: 'Invalid Request. Please provide userEmail, pickupCoordinates, deliveryCoordinates and productId' });
  }

  try {
    const { productId, ...orderDetails } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      const updatedOrderDetails = {
        ...orderDetails,
        product: product._id,
        transactionId: uuidv4(),
        status: 'pending', // Default status is 'pending'
      };
      const newOrder = await OrderService.createOrder(updatedOrderDetails);

      res.status(201).json(newOrder);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = req.params?.orderId;
  const updatedFields = req.body;

  if (!orderId || !updatedFields) {
    res.status(400).json({ error: 'Invalid Request. Please provide order ID and the updated Fields' });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = OrderService.updateOrder(orderId, updatedFields);

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update order' });
  }
});
