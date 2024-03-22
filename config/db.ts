import { connect } from "mongoose";
import colors from "colors";
import AppConfig from '.';

const connectDB = async () => {
    try {
        const conn = await connect(AppConfig.MONGODB_URI as string);

        console.log(
            colors.cyan.underline(`MongoDB Connected: ${conn.connection.host}`)
        );
    } catch (error) {
        console.log(
            colors.red.underline(`Mongo DB Connection Error: ${(error as Error).message}`)
        );
        process.exit(1);
    }
};

export default connectDB;