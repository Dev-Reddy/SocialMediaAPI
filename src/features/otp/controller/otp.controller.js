import OTPRepository from "../repository/otp.repository.js";
import bcrypt from "bcrypt";

export default class OTPController {
  constructor() {
    this.otpRepository = new OTPRepository();
  }

  async sendOtp(req, res, next) {
    try {
      const { email } = req.body;

      await this.otpRepository.sendOtp(email);

      return res.status(200).send({
        message: `OTP sent to ${email}`,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }

  async verifyOTP(req, res, next) {
    try {
      const { email, otp } = req.body;

      const verified = await this.otpRepository.verifyOTP(email, otp);

      if (!verified) {
        return res.status(400).send({
          message: "Incorrect Otp",
        });
      } else {
        return res.status(200).send({
          message: "Otp verified",
        });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }
  async resetPassword(req, res, next) {
    try {
      const { email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      await this.otpRepository.resetPassword(email, hashedPassword);

      return res.status(201).send({
        message: "Password was reset successfully",
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }
}
