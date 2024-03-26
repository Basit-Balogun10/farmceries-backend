import { NextFunction, Request, Response } from "express";
import { generateRedisKey, isRedisWorking, readData, writeData } from "../config/redis.js";

const redisCacheMiddleware = (
  options = {
    EX: 21600, // 6h
  }
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (isRedisWorking()) {
      const key = generateRedisKey(req);
      
      // if there is some cached data, retrieve it and return it
      const cachedValue = await readData(key);
      if (cachedValue) {
        try {
          return res.json(JSON.parse(cachedValue));
        } catch {
          // if it is not JSON data, then return it
          return res.send(cachedValue);
        }
      } else {
        // override how res.send behaves to introduce the caching logic
        const oldSend = res.send;
        res.send = function (data) {
          // set the function back to avoid the 'double-send' effect
          res.send = oldSend;

          // cache the response only if it is successful
          if (res.statusCode.toString().startsWith("2")) {
            writeData(key, data, options).then();
          }

          return res.send(data);
        };

        // continue to the controller function
        next();
      }
    } else {
      // proceed with no caching
      next();
    }
  };
}

export default redisCacheMiddleware