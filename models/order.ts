import mongoose, { Schema } from "mongoose";
import { OrderStatus } from "../types";

export interface IOrder {
    userEmail: string;
    transactionId: string;
    product: Schema.Types.ObjectId; // Assuming Types.ObjectId is imported from mongoose
    status: "pending" | "delivered";
}

const orderSchema = new mongoose.Schema<IOrder>({
    userEmail: String,
    transactionId: String,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    status: {
        type: String,
        enum: ["pending", "delivered"],
        default: "pending",
    },
});

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;