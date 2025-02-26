import express from "express";
import OTPController from "../controller/otp.controller.js";

const otpRouter = express.Router();

const otpController = new OTPController();

otpRouter.post("/send", (req, res) => {
  otpController.sendOtp(req, res);
});

otpRouter.post("/verify", (req, res) => {
  otpController.verifyOTP(req, res);
});

otpRouter.post("/reset-password", (req, res) => {
  otpController.resetPassword(req, res);
});

export default otpRouter;
