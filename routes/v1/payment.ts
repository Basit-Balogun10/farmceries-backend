import express from "express";
import { createPaystackPaymentLink, verifyPaystackPayment, receivePaystackWebhookEvent } from "../../handlers/payment/index.js";

const paymentRouter = express.Router();

paymentRouter.post("/paystack/payment-link", createPaystackPaymentLink);
paymentRouter.get("/paystack/verify-payment", verifyPaystackPayment);
paymentRouter.post("/paystack/webhook", receivePaystackWebhookEvent);

export default paymentRouter;