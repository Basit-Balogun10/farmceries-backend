import express from "express";
import { createOrder, getOrders, updateOrderStatus } from "../../handlers/order/index.js";

const router = express.Router();

router.get("/all", getOrders);
router.post("/create", createOrder);
router.put("/update-status", updateOrderStatus);

export default router;