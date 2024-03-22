import express from "express";
import { createPaystackPaymentLink, verifyPaystackPayment } from "../../handlers/payment/index.js";

const paymentRouter = express.Router();

paymentRouter.post("/paystack/payment-link", createPaystackPaymentLink);
paymentRouter.get("/paystack/verify-payment", verifyPaystackPayment);

export default paymentRouter;