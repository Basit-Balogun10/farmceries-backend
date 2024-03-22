import express from "express";
import { createFlutterwavePaymentLink, createPaystackPaymentLink, verifyPaystackPayment } from "../../handlers/payment";

const paymentRouter = express.Router();

// paymentRouter.post("/flutterwave/payment-link", createFlutterwavePaymentLink);
paymentRouter.post("/paystack/payment-link", createPaystackPaymentLink);
paymentRouter.get("/paystack/verify-payment", verifyPaystackPayment);

export default paymentRouter;