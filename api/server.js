import express from "express";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
// import { corsHandler } from "./middleware/corsMiddleware";
import mongoose from "mongoose";
import axios from 'axios'

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(corsHandler);
// Connect to MongoDB (replace 'your_mongo_db_url' with your actual MongoDB URL)
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
    aliases: [String],
    image: String,
    shortDesc: String,
    longDesc: String,
    dateUploaded: { type: Date, default: Date.now },
    rating: Number,
    reviewsCount: Number,
    availabilityCount: Number,
    hasPriceRange: Boolean,
    price: Number,
    minPrice: Number,
    maxPrice: Number,
    shelfLife: String,
    vendor: String,
    category: {
        type: String,
        enum: [
            "Vegetables",
            "Fruits",
            "Water",
            "Drink",
            "Flowers",
            "Cereals",
            "Grains",
            "Spices",
            "Poultry",
            "Pets",
            "Livestock",
        ],
    },
});

const Product = mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
    userEmail: String,
    transactionId: String,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    status: {
        type: String,
        enum: ["pending", "delivered"],
        default: "pending",
    },
});

const Order = mongoose.model("Order", orderSchema);

// // Middleware
// app.use(bodyParser.json());

app.get("/api/products", async (req, res) => {
    const count = parseInt(req.query.count, 10) || 20;
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
});

app.get("/api/orders", async (req, res) => {
    const { userEmail } = req.query;

    try {
        const orders = await Order.find({ userEmail });

        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Sample route to add a new order for a user
app.post("/api/orders", async (req, res) => {
    const { userEmail, productId } = req.body;

    try {
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Create a new order
        const newOrder = await Order.create({
            userEmail,
            product: product._id,
            transactionId: uuidv4(),
            status: "pending", // Default status is 'pending'
        });

        res.json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.put("/api/orders", async (req, res) => {
    const { orderId, status } = req.query;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.status = status;

        await order.save();

        res.status(200).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/flutterwave/payment-link", async (req, res) => {
    try {
        const response = await axios.post(
            "https://api.flutterwave.com/v3/payments",
            {
                tx_ref: uuidv4(),
                amount: req.body.amount,
                redirect_url: req.body.redirect_url,
                customer: req.body.customer,
                customizations: {
                    title: "Farmceries Payment",
                },
                payment_options: "card, account, banktransfer, ussd",
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                },
            }
        );

        res.json(response.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
