import express from "express";
import { getProducts } from "../../handlers/product";

const productRouter = express.Router();

productRouter.get("/all", getProducts);

export default productRouter;