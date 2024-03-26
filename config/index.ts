import dotenv from 'dotenv';
dotenv.config();

const AppConfig = {
  AUTH_HEADER_NAME: process.env.AUTH_HEADER_NAME as string,
  ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM as string,
  FLW_SECRET_KEY: process.env.FLW_SECRET_KEY as string,
  GOOGLE_OAUTH2_CLIENT_ID: process.env.GOOGLE_OAUTH2_CLIENT_ID as string,
  GOOGLE_OAUTH2_CLIENT_SECRET: process.env.GOOGLE_OAUTH2_CLIENT_SECRET as string,
  INIT_VECTOR: process.env.INIT_VECTOR as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  LIVE_BACKEND_URL: process.env.LIVE_BACKEND_URL as string,
  LIVE_MOBILE_APP_DEEP_LINK: process.env.LIVE_MOBILE_APP_DEEP_LINK as string,
  LOCAL_BACKEND_URL: process.env.LOCAL_BACKEND_URL as string,
  LOCAL_MOBILE_APP_DEEP_LINK: process.env.LOCAL_MOBILE_APP_DEEP_LINK as string,
  MONGODB_URI: process.env.MONGODB_URI as string,
  NODE_ENV: process.env.NODE_ENV as string,
  NODEMAILER_USER_EMAIL: process.env.NODEMAILER_USER_EMAIL as string,
  NODEMAILER_USER_PASSWORD: process.env.NODEMAILER_USER_PASSWORD as string,
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY as string,
  PORT: process.env.PORT || (3000 as string | number),
  RAPID_API_KEY: process.env.RAPID_API_KEY as string,
  RAPID_API_HOST: process.env.RAPID_API_HOST as string,
  RAPID_API_AUTH_TOKEN: process.env.RAPID_API_AUTH_TOKEN as string,
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_PORT: process.env.REDIS_PORT || (6379 as string | number),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
  SECRET_KEY: process.env.SECRET_KEY as string,
};

export default AppConfig;
