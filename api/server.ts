import express from "express";
import v1Router from '../routes/v1/index.js';
import AppConfig from "../config/index.js"
import connectDB from "../config/db.js";    
// import { corsHandler } from "./middleware/corsMiddleware,js";
import { errorHandler } from "../middleware/errorMiddleware.js";

connectDB()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// // Middleware
// app.use(bodyParser.json());

app.use('/api/v1', v1Router);

app.use(errorHandler)

// Start the server
app.listen(AppConfig.PORT, () => {
    console.log(`Server is running on port ${AppConfig.PORT}`);
});

export default app;
