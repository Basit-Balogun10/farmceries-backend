import dotenv from 'dotenv';
dotenv.config();

const AppConfig = {
	LIVE_BACKEND_URL: process.env.LIVE_BACKEND_URL as string,
	LOCAL_BACKEND_URL: process.env.LOCAL_BACKEND_URL as string,
	LOCAL_MOBILE_APP_DEEP_LINK: process.env.LOCAL_MOBILE_APP_DEEP_LINK as string,
	LIVE_MOBILE_APP_DEEP_LINK: process.env.LIVE_MOBILE_APP_DEEP_LINK as string,
	ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM as string,
	GOOGLE_OAUTH2_CLIENT_ID: process.env.GOOGLE_OAUTH2_CLIENT_ID as string,
	GOOGLE_OAUTH2_CLIENT_SECRET: process.env.GOOGLE_OAUTH2_CLIENT_SECRET as string,
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
