import express from "express";
import { getProducts } from "../../handlers/product/index.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);

export default productRouter;