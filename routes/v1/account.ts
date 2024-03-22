import express from "express";
import { createAccount, updateAccount } from "../../handlers/account/index.js";

const accountRouter = express.Router();

accountRouter.post("/", createAccount);
accountRouter.put("/:id", updateAccount);

export default accountRouter;