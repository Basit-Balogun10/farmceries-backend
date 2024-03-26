import express from "express";
import { createPaystackPaymentLink, verifyPaystackPayment, receivePaystackWebhookEvent } from "../../handlers/payment/index.js";
import { protect } from "../../middleware/authMiddleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/paystack/payment-link", protect, createPaystackPaymentLink);
paymentRouter.get("/paystack/verify-payment", protect, verifyPaystackPayment);
paymentRouter.post("/paystack/webhook", receivePaystackWebhookEvent);

export default paymentRouter;