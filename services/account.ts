import { Types } from 'mongoose';
import Account, { IAccount, EndUser, Vendor, Farmer, Courier, IEndUser, IVendor, IFarmer, ICourier } from '../models/account.js';
import { AccountRole } from '../types/index.js';

export class AccountService {
  static async createAccount(profile: IAccount & Partial<IEndUser & IVendor & IFarmer & ICourier>) {
    // create account
    const newAccount = await Account.create(profile);
    let newUser: IEndUser | IVendor | IFarmer | ICourier = {} as IEndUser | IVendor | IFarmer | ICourier;

    switch (profile.role) {
      case AccountRole.END_USER:
        newUser = await EndUser.create({ account: newAccount._id, deliveryAddresses: profile.deliveryAddresses });
        break;
      case AccountRole.VENDOR:
        newUser = await Vendor.create({
          account: newAccount._id,
          products: profile.products,
          rating: profile.rating,
          payoutDetails: profile.payoutDetails,
        });
        break;
      case AccountRole.FARMER:
        newUser = await Farmer.create({
          account: newAccount._id,
          products: profile.products,
          rating: profile.rating,
          payoutDetails: profile.payoutDetails,
        });
        break;
      case AccountRole.COURIER:
        newUser = await Courier.create({
          account: newAccount._id,
          orders: profile.orders,
          rating: profile.rating,
          payoutDetails: profile.payoutDetails,
          locality: profile.locality,
          mode: profile.mode,
        });
        break;

      default:
        break;
    }
    return { newAccount, newUser };
  }

  static async getAccountById(accountId: Types.ObjectId) {
    return await Account.findById(accountId)
  }

  static async getAccountByEmail(email: string) {
    return await Account.findOne({ email });
  }

  static async updateAccount(accountId: string, updatedProfile: Partial<IAccount>) {
    return await Account.findByIdAndUpdate(accountId, { $set: updatedProfile }, { new: true });
  }

  static async updateEndUser(account: IAccount, updatedProfile: Partial<IEndUser>) {
    return await EndUser.findOneAndUpdate({ 'account.email': account.email }, { $set: updatedProfile }, { new: true });
  }

  static async updateVendor(account: IAccount, updatedProfile: Partial<IVendor>) {
    // Find vendor by account email and update
    return await Vendor.findOneAndUpdate({ 'account.email': account.email }, { $set: updatedProfile }, { new: true });
  }

  static async updateFarmer(account: IAccount, updatedProfile: Partial<IFarmer>) {
    return await Farmer.findOne({ 'account.email': account.email }, { $set: updatedProfile }, { new: true });
  }

  static async updateCourier(account: IAccount, updatedProfile: Partial<ICourier>) {
    return await Courier.findOne({ 'account.email': account.email }, { $set: updatedProfile }, { new: true });
  }

  static async deleteAccount(account: IAccount) {
    if (account.role === AccountRole.END_USER) {
      const endUser = await EndUser.findOne({ account: account.email });
      endUser?.deleteOne();
    } else if (account.role === AccountRole.VENDOR) {
      const vendor = await Vendor.findOne({ account: account.email });
      vendor?.deleteOne();
    } else if (account.role === AccountRole.FARMER) {
      const farmer = await Farmer.findOne({ account: account.email });
      farmer?.deleteOne();
    } else if (account.role === AccountRole.COURIER) {
      const courier = await Courier.findOne({ account: account.email });
      courier?.deleteOne();
    }

    account.deleteOne();
    console.log('Account deleted');
  }
}
