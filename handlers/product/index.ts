import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { ProductService } from '../../services/product.js';
import Product from '../../models/product.js';

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = req.body;

  if (!product) {
    res.status(400).json({ error: 'Invalid request. Please provide product details' });
  }

  try {
    const newProduct = ProductService.createProduct(product);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create product' });
  }
});

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const count = parseInt(req?.query?.count as string, 10) || 20;
  const random = req.query.random === 'true';

  try {
    await ProductService.getProducts(count, random);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update product' });
  }
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const updatedFields = req.body;

  if (!productId || !updatedFields) {
    res.status(400).json({ error: 'Invalid request. Please provide product ID and the updated fields' });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = ProductService.updateProduct(productId, updatedFields);

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update product' });
  }
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  if (!productId) {
    res.status(400).json({ error: 'Invalid request. Please provide product ID' });
  }

  try {
    await ProductService.deleteProductById(productId);

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete product' });
  }
});
