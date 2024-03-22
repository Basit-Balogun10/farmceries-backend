import dotenv from 'dotenv';
dotenv.config();

const AppConfig = {
	APP_LIVE_URL: process.env.APP_LIVE_URL as string,
	AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME as string,
	BASE_BACKEND_URL: process.env.BASE_BACKEND_URL as string,
	BASE_FRONTEND_URL: process.env.BASE_FRONTEND_URL as string,
	CHARACTER_ENCODING: process.env.CHARACTER_ENCODING as string,
	ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM as string,
	GOOGLE_OAUTH2_CLIENT_ID: process.env.GOOGLE_OAUTH2_CLIENT_ID as string,
	GOOGLE_OAUTH2_CLIENT_SECRET: process.env.GOOGLE_OAUTH2_CLIENT_SECRET as string,
	OAUTH_STATE_PARAM_NAME: process.env.OAUTH_STATE_PARAM_NAME as string,
	SECRET_KEY: process.env.SECRET_KEY as string,
	INIT_VECTOR: process.env.INIT_VECTOR as string,
	JWT_SECRET: process.env.JWT_SECRET as string,
	MONGODB_URI: process.env.MONGODB_URI as string,
	NODE_ENV: process.env.NODE_ENV as string,
	PORT: process.env.PORT || 3000 as string | number,
	FLW_SECRET_KEY: process.env.FLW_SECRET_KEY as string,
	PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY as string,
};

export default AppConfig;
