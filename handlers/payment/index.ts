import { Request, Response } from "express";
import asyncHandler from 'express-async-handler'
import axios from "axios";
import crypto from 'crypto'
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import AppConfig from "../../config/index.js";
import PAYSTACK_EVENT_HEADER from "../../utils/constants.js";

dotenv.config();

export const createFlutterwavePaymentLink = asyncHandler(async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            "https://api.flutterwave.com/v3/payments",
            {
                tx_ref: uuidv4(),
                amount: req.body.amount,
                redirect_url: req.body.redirect_url,
                customer: req.body.customer,
                customizations: {
                    title: "Farmceries Payment",
                },
                payment_options: "card, account, banktransfer, ussd",
            },
            {
                headers: {
                    Authorization: `Bearer ${AppConfig.FLW_SECRET_KEY}`,
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export const createPaystackPaymentLink = asyncHandler(async (req: Request, res: Response) => {
    console.log("callback: ", req.body.callback_url);
    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                reference: uuidv4(),
                callback_url: req.body.callback_url,
                amount: req.body.amount,
                email: req.body.email,
                channels: [
                    "card",
                    "bank",
                    "ussd",
                    "qr",
                    "mobile_money",
                    "bank_transfer",
                    "eft",
                ],
                metadata: {
                    cancel_action: req.body.cancellation_url,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${AppConfig.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export const receivePaystackWebhookEvent = asyncHandler(async (req: Request, res: Response) => {
    const hash = crypto.createHmac('sha512', AppConfig.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    
    if (hash == req.headers[PAYSTACK_EVENT_HEADER]) {

        
        // Retrieve the request's body
        const event = req.body;
        
        console.log("PAYMENT EVENT: ", event);
        res.send(200);
    }
})

export const verifyPaystackPayment = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { reference, amount } = req.query;

        if (!reference || !amount) {
            return res.status(400).json({
                error: "Invalid request. Please provide reference and amount",
            });
        }

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${AppConfig.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const isPaymentSuccessful =
            response.data?.data?.status === "success" &&
            response.data?.data?.amount?.toString() === amount?.toString();

        console.log(response.data.data.status, response.data.data.amount, amount?.toString(), isPaymentSuccessful)

        res.json({ success: isPaymentSuccessful });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});