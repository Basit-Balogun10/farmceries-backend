import { Types } from 'mongoose';
import Order, { IOrder } from '../models/order.js';

export class OrderService {
  static async createOrder(order: Partial<IOrder>) {
    return await Order.create(order);
  }

  static async getOrders(userEmail: string) {
    return Order.find({ userEmail });
  }

  static async updateOrder(orderId: string, updatedFields: Partial<IOrder>) {
    return Order.findByIdAndUpdate(orderId, { $set: updatedFields }, { new: true });
  }

  static async removeCourierReferences(courierId: Types.ObjectId) {
    return Order.updateMany({ courier: courierId }, { $unset: { courier: '' } });
  }

  static async removeVendorReferences(vendorId: Types.ObjectId) {
    return Order.updateMany({ vendor: vendorId }, { $unset: { vendor: '' } });
  }

  static async removeFarmerReferences(farmerId: Types.ObjectId) {
    return Order.updateMany({ farmer: farmerId }, { $unset: { farmer: '' } });
  }
}
