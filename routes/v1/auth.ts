import express from "express";
import { sendOTP, resendOTP, verifyOTP, authenticateWithGoogle } from "../../handlers/auth/index.js";

const authRouter = express.Router();

authRouter.get("/google", authenticateWithGoogle);
authRouter.post("/send-otp", sendOTP);
authRouter.post("/resend-otp", resendOTP);
authRouter.post("/verify-otp", verifyOTP);

export default authRouter;