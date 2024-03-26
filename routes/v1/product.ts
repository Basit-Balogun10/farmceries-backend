import express from "express";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../../handlers/product/index.js";
import { protect } from "../../middleware/authMiddleware.js";

const productRouter = express.Router();

productRouter.get("/", protect, getProducts);
productRouter.post('/', protect, createProduct);
productRouter.put("/:productId", protect, updateProduct);
productRouter.delete('/:productId', protect, deleteProduct);


export default productRouter;