import dotenv from 'dotenv';
dotenv.config();

const AppConfig = {
	APP_LIVE_URL: process.env.APP_LIVE_URL,
	AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
	BASE_BACKEND_URL: process.env.BASE_BACKEND_URL,
	BASE_FRONTEND_URL: process.env.BASE_FRONTEND_URL,
	MONGODB_URI: process.env.MONGODB_URI,
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT || 3000,
	FLW_SECRET_KEY: process.env.FLW_SECRET_KEY,
	PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
};

export default AppConfig;
