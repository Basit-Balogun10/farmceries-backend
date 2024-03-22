import express from "express";
import v1Router from '../routes/v1/index';
import AppConfig from "../config/db.ts"
import connectDB from "../config/db";
// import { corsHandler } from "./middleware/corsMiddleware";
import { errorHandler } from "../middleware/errorMiddleware";

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
