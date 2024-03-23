import { model, Schema } from 'mongoose';
import {IOrder} from "./order.js"
import {IProduct} from "./product.js"

export interface IAccount {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    photoUrl?: string;
    googleRefreshToken?: string;

    type: "end_user" | "vendor" | "farmer" | "courier";
}


export interface IEndUser {
    account: Schema.Types.ObjectId;
    deliveryAddresses: string[];
}

export interface IVendor {
    account: Schema.Types.ObjectId;
    products: IProduct[];
    rating: number;
    payoutDetails: {
        accountNumber: string;
        accountName: string;
    };
}

export interface IFarmer {
    account: Schema.Types.ObjectId;
    products: IProduct[];
    rating: number;
    payoutDetails: {
        accountNumber: string;
        accountName: string;
    };
}

interface ICourier {
    account: Schema.Types.ObjectId;
    orders: IOrder[];
    rating: number;
    payoutDetails: {
        accountNumber: string;
        accountName: string;
    };
    locality: string;
    mode: "leg" | "bicycle" | "scooter" | "truck";
}

const accountSchema = new Schema<IAccount>({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    type: {
        type: String,
        enum: ["end_user", "vendor", "farmer", "courier"],
    },
    photoUrl: {
        type: String,
        required: false,
    },
    googleRefreshToken: {
        type: String,
        required: false,
    },
}, {
    _id: true,
    timestamps: true,
});

const endUserSchema = new Schema<IEndUser>({
    account: { type: Schema.Types.ObjectId, ref: "Account" },
    deliveryAddresses: [String],
});

const vendorSchema = new Schema<IVendor>({
        account: { type: Schema.Types.ObjectId, ref: "Account" },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    rating: Number,
    payoutDetails: {
        accountNumber: String,
        accountName: String,
    },
});

const farmerSchema = new Schema<IFarmer>({
        account: { type: Schema.Types.ObjectId, ref: "Account" },

    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    rating: Number,
    payoutDetails: {
        accountNumber: String,
        accountName: String,
    },
});

const courierSchema = new Schema<ICourier>({
        account: { type: Schema.Types.ObjectId, ref: "Account" },

    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    rating: Number,
    payoutDetails: {
        accountNumber: String,
        accountName: String,
    },
    locality: String,
    mode: { type: String, enum: ["leg", "bicycle", "scooter", "truck"] },
});

const Account = model<IAccount>("Account", accountSchema);
export const EndUser = model<IEndUser>("EndUser", endUserSchema);
export const Vendor = model<IVendor>("Vendor", vendorSchema);
export const Farmer = model<IFarmer>("Farmer", farmerSchema);
export const Courier = model<ICourier>("Courier", courierSchema);

export default Account