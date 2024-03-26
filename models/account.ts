import { model, Schema, Document } from 'mongoose';
import { IOrder } from './order.js';
import { IProduct } from './product.js';
import { ProductService } from '../services/product.js';
import { OrderService } from '../services/order.js';
import { AccountRole } from '../types/index.js';

export interface IAccount extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  photoURL?: string;
  googleRefreshToken?: string;
  role: AccountRole;
}

export interface IEndUser extends Document {
  account: Schema.Types.ObjectId;
  deliveryAddresses: string[];
}

export interface IVendor extends Document {
  account: Schema.Types.ObjectId;
  products: IProduct[];
  rating: number;
  payoutDetails: {
    accountNumber: string;
    accountName: string;
  };
}

export interface IFarmer extends Document {
  account: Schema.Types.ObjectId;
  products: IProduct[];
  rating: number;
  payoutDetails: {
    accountNumber: string;
    accountName: string;
  };
}

export interface ICourier extends Document {
  account: Schema.Types.ObjectId;
  orders: IOrder[];
  rating: number;
  payoutDetails: {
    accountNumber: string;
    accountName: string;
  };
  locality: string;
  mode: 'leg' | 'bicycle' | 'scooter' | 'truck';
}

const accountSchema = new Schema<IAccount>(
  {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    role: {
      type: String,
      enum: ['end_user', 'vendor', 'farmer', 'courier'],
    },
    photoURL: {
      type: String,
      required: false,
    },
    googleRefreshToken: {
      type: String,
      required: false,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

const endUserSchema = new Schema<IEndUser>({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  deliveryAddresses: [String],
});

const vendorSchema = new Schema<IVendor>({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  rating: Number,
  payoutDetails: {
    accountNumber: String,
    accountName: String,
  },
});

const farmerSchema = new Schema<IFarmer>({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },

  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  rating: Number,
  payoutDetails: {
    accountNumber: String,
    accountName: String,
  },
});

const courierSchema = new Schema<ICourier>({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  rating: Number,
  payoutDetails: {
    accountNumber: String,
    accountName: String,
  },
  locality: String,
  mode: { type: String, enum: ['leg', 'bicycle', 'scooter', 'truck'] },
});

vendorSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const productIds = this.products;
  const account = await Account.findById(this.account);

  console.log(`Cascading vendor ${account?.email} deletion`);

  await ProductService.deleteProductsByIds(productIds);
  await OrderService.removeVendorReferences(this._id);

  next();
});

farmerSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const productIds = this.products;
  const account = await Account.findById(this.account);

  console.log(`Cascading farmer ${account?.email} deletion`);

  await ProductService.deleteProductsByIds(productIds);
  await OrderService.removeFarmerReferences(this._id);

  next();
});

courierSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const account = await Account.findById(this.account);

  console.log(`Cascading courier ${account?.email} deletion`);

  OrderService.removeCourierReferences(this._id);

  next();
});

const Account = model<IAccount>('Account', accountSchema);
export const EndUser = model<IEndUser>('EndUser', endUserSchema);
export const Vendor = model<IVendor>('Vendor', vendorSchema);
export const Farmer = model<IFarmer>('Farmer', farmerSchema);
export const Courier = model<ICourier>('Courier', courierSchema);

export default Account;
