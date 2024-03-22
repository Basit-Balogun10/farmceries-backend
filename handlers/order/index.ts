import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Order from "../../models/order.js";
import Product from "../../models/product.js";
import { OrderStatus } from "../../types/index.js";

export const getOrders = async (req: Request, res: Response) => {
    const { userEmail } = req.query;

    if (!userEmail) {
        return res.status(400).json({ error: "Invalid Request. Please provide userEmail" });
    }

    try {
        const orders = await Order.find({ userEmail });

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const createOrder = async (req: Request, res: Response) => {
    const { userEmail, productId } = req.body;
    
    if (!userEmail || !productId) {
        return res.status(400).json({ error: "Invalid Request. Please provide userEmail and productId" });
    }

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Create a new order
        const newOrder = await Order.create({
            userEmail,
            product: product._id,
            transactionId: uuidv4(),
            status: "pending", // Default status is 'pending'
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const orderId = req.params?.orderId
    const status = req.body?.status as OrderStatus.PENDING

    if (!orderId || !status) {
        return res.status(400).json({ error: "Invalid Request. Please provide orderId and status" });
    }

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.status = status;

        await order.save();

        res.status(200).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};