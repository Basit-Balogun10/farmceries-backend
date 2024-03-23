import express from "express";
import session from "express-session"
import v1Router from '../routes/v1/index.js';
import AppConfig from "../config/index.js"
import connectDB from "../config/db.js";    
// import { corsHandler } from "./middleware/corsMiddleware,js";
import { errorHandler } from "../middleware/errorMiddleware.js";

connectDB()

var app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: AppConfig.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
			secure: true,
			httpOnly: true,
			sameSite: 'none' as const }
}))

// // Middleware
// app.use(bodyParser.json());

app.use('/api/v1', v1Router);

app.use(errorHandler)

// Start the server
app.listen(AppConfig.PORT, () => {
    console.log(`Server is running on port ${AppConfig.PORT}`);
});

export default app;
