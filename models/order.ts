import { model,  Schema } from "mongoose";

export interface IOrder {
    userEmail: string;
    transactionId: string;
    product: Schema.Types.ObjectId; // Assuming Types.ObjectId is imported from mongoose
    status: "pending" | "delivered";
}

const orderSchema = new Schema<IOrder>({
    userEmail: String,
    transactionId: String,
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    status: {
        type: String,
        enum: ["pending", "delivered"],
        default: "pending",
    },
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;