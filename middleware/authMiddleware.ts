import { Request, Response, NextFunction, } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Account, { IAccount } from "../models/account.js"
import AppConfig from "../config/index.js";

export interface IAccountInfoRequest extends Request {
    user?: IAccount;
}

export const protect = asyncHandler(async (req: IAccountInfoRequest,
    res: Response,
    next: NextFunction) => {
    const token = AppConfig.AUTH_HEADER_NAME in req.headers ? req.headers[AppConfig.AUTH_HEADER_NAME] as string : undefined;
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

    try {
        // Get token from headers
        console.log(`AUTH TOKEN: , ${token}`);

        // Verify token
        const decoded = jwt.verify(token, (process.env.JWT_SECRET) as string);
        console.log('DECODED TOKEN: ', decoded)

        req.user = await Account.findById((decoded as JwtPayload).id) as (undefined | IAccount);

        next();
    } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized");
    }

});