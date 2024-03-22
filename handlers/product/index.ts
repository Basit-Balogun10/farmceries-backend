import { Request, Response } from "express";
import Product from "../../models/product.js";

export const getProducts = async (req: Request, res: Response) => {
    const count = parseInt(req?.query?.count as string, 10) || 20;
    const random = req.query.random === "true";

    try {
        if (random) {
            const randomProducts = await Product.aggregate([
                { $sample: { size: count } },
            ]);

            res.status(200).json(randomProducts);
        } else {
            const products = await Product.find({}).limit(count);

            res.status(200).json(products);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};