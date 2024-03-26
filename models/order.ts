import { Document, model,  Schema } from "mongoose";

export interface IOrder extends Document {
    endUser: Schema.Types.ObjectId;
    vendor?: Schema.Types.ObjectId;
    farmer?: Schema.Types.ObjectId;
    courier?: Schema.Types.ObjectId;
    transactionId: string;
    product: Schema.Types.ObjectId;
    pickupCoordinates: string;
    deliveryCoordinates: string;
    status: "pending" | "delivered";
}

const orderSchema = new Schema<IOrder>({
    transactionId: String,
    endUser: {
        type: Schema.Types.ObjectId,
        ref: "EndUser",
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
        required: false
    },
    farmer: {
        type: Schema.Types.ObjectId,
        ref: "Farmer",
        required: false
    },
    courier: {  
        type: Schema.Types.ObjectId,
        ref: "Courier",
        required: false
    },
    product: {
        
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    pickupCoordinates: String,
    deliveryCoordinates: String,
    status: {
        type: String,
        enum: ["pending", "delivered"],
        default: "pending",
    },
});

const Order = model<IOrder>("Order", orderSchema);

export default Order;