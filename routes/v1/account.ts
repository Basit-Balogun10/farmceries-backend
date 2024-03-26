import express from "express";
import { createAccount, updateAccount, deleteAccount} from "../../handlers/account/index.js";
import { protect } from "../../middleware/authMiddleware.js";

const accountRouter = express.Router();

accountRouter.post("/", createAccount);
accountRouter.put("/:accountId", protect, updateAccount);
accountRouter.delete("/:accountId", protect, deleteAccount);

export default accountRouter;