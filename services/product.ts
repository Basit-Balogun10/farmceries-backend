import Product, { IProduct } from '../models/product.js';

export class ProductService {
  static async createProduct(product: IProduct) {
    return await Product.create(product);
  }

  static async getProducts(count: number, random: boolean) {
    if (random) {
      return await Product.aggregate([{ $sample: { size: count } }]);
    } else {
      return await Product.find({}).limit(count);
    }
  }

  static async updateProduct(productId: string, updatedFields: Partial<IProduct>) {
    return await Product.findByIdAndUpdate(productId, { $set: updatedFields }, { new: true });
  }

  static async deleteProductById(productId: string) {
    return await Product.findByIdAndDelete(productId);
  }

  static async deleteProductsByIds(productIds: IProduct[]) {
    return await Product.deleteMany({ _id: { $in: productIds } });
  }
}
