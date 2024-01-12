import { Request, Response, NextFunction, } from "express";
import type { IUser } from "../models/userModel"

import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

export interface IUserInfoRequest extends Request {
    user?: IUser;
}

export const protect = asyncHandler(async (req: IUserInfoRequest,
    res: Response,
    next: NextFunction) => {
    let token;

    
    try {
        // Get token from cookies
        token = req.cookies["NDIC_token"] as string;
        console.log(`USER TOKEN, ${token}`);

        // Verify token
        const decoded = jwt.verify(token, (process.env.JWT_SECRET) as string);
        console.log(decoded, 'DECODED TOKEN')

        req.user = (await User.findById((decoded as JwtPayload).id).select("-password")) as (undefined | IUser);

        next();
    } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized");
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});