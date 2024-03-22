import express from "express";
import { createOrder, getOrders, updateOrderStatus } from "../../handlers/order/index.js";

const orderRouter = express.Router();

orderRouter.get("/", getOrders);
orderRouter.post("/", createOrder);
orderRouter.put("/:id", updateOrderStatus);

export default orderRouter;