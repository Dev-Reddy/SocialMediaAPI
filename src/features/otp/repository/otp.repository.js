import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import otpSchema from "../schema/otp.schema.js";
import { ApplicationError } from "../../../error/applicationError.js";
import UserRepository from "../../user/repository/user.repository.js";
import { sendOTPEmail } from "../../../utils/sendOtp.js";

// creating otp model from otp schema
const OTPModel = mongoose.model("OTPModel", otpSchema);

// userRepository for user methods
const userRepository = new UserRepository();

// otp class
export default class OTPRepository {
  async sendOtp(email) {
    try {
      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        throw new ApplicationError("User not found", 404);
      }

      const currentOtp = await sendOTPEmail(email);

      let user_otp = await OTPModel.findById(user._id);

      //   if user doesn't already exist in otp model
      //   create it
      if (!user_otp) {
        user_otp = new OTPModel({
          user: new ObjectId(user._id),
          otp: {
            code: currentOtp,
            time: Date.now(),
          },
          verified: {
            status: false,
          },
        });
        await user_otp.save();
      } else {
        user_otp.otp = {
          code: currentOtp,
          time: Date.now(),
        };
        user_otp.verified = {
          status: false,
        };
        user_otp.save();
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("There was an error while sending OTP", 500);
    }
  }

  async verifyOTP(email, otpInput) {
    try {
      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        throw new ApplicationError("User not found", 404);
      }

      const user_otp = await OTPModel.findOne({ user: user._id });

      if (!user_otp) {
        throw new ApplicationError("OTP not found", 400);
      }

      // Ensure OTP fields are defined before accessing them
      if (!user_otp.otp || !user_otp.otp.code || !user_otp.otp.time) {
        throw new ApplicationError("Invalid OTP data", 400);
      }

      // Check if OTP has expired (10 minutes)
      if ((Date.now() - user_otp.otp.time) / 60000 > 10) {
        throw new ApplicationError("OTP Expired", 400);
      }

      if (otpInput == user_otp.otp.code) {
        // ✅ Use $unset to remove the otp field completely instead of setting it to null
        await OTPModel.updateOne(
          { user: user._id },
          {
            $unset: { otp: "" }, // Removes the otp field
            $set: {
              "verified.status": true,
              "verified.time": Date.now(),
            },
          }
        );

        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "There was an error while verifying OTP.",
        500
      );
    }
  }

  async resetPassword(email, password) {
    try {
      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        throw new ApplicationError("User not found", 404);
      }

      const user_otp = await OTPModel.findOne({ user: user._id });

      if (!user_otp || !user_otp.verified || !user_otp.verified.status) {
        throw new ApplicationError("Verify OTP first", 400);
      }

      // Check if OTP verification has expired (10 minutes)
      if ((Date.now() - user_otp.verified.time) / 60000 > 10) {
        user_otp.verified.status = false;
        await user_otp.save();
        throw new ApplicationError("OTP Expired", 400);
      }

      await userRepository.resetPassword(user._id, password);
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "There was an error while resetting the password.",
        500
      );
    }
  }
}
