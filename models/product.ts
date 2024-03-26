import { model, Schema } from "mongoose";

export interface IProduct extends Document {
    id: number;
    name: string;
    aliases: string[];
    image: string;
    shortDesc: string;
    longDesc: string;
    dateUploaded?: Date;
    rating: number;
    reviewsCount: number;
    availabilityCount: number;
    hasPriceRange: boolean;
    price?: number;
    minPrice?: number;
    maxPrice?: number;
    shelfLife: string;
    category: "Vegetables" | "Fruits" | "Water" | "Drink" | "Flowers" | "Cereals" | "Grains" | "Spices" | "Poultry" | "Pets" | "Livestock";
}


const productSchema = new Schema<IProduct>({
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

const Product = model<IProduct>("Product", productSchema);

export default Product;