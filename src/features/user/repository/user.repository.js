import mongoose from "mongoose";
import userSchema from "../schema/user.schema.js";
import { ApplicationError } from "../../../error/applicationError.js";

// creating user model from user schema
const UserModel = mongoose.model("User", userSchema);

// UserRepository class
export default class UserRepository {
  // signUp method to save user
  async signUp(user) {
    try {
      const newUser = new UserModel(user);
      return await newUser.save();
    } catch (err) {
      console.log(err);
      if (err.code === 11000) {
        throw new ApplicationError("User already exists", 409);
      }

      throw new ApplicationError("There was an error while saving user", 500);
    }
  }

  // getUserByEmail method to get user by email
  async getUserByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("There was an error while fetching user", 500);
    }
  }

  // signIn method to sign in user and save token
  async signIn(userID, jwtToken) {
    try {
      const user = await UserModel.findById(userID);

      if (!user) {
        throw new ApplicationError("User not found", 404);
      }

      user.loginSessions.push({ token: jwtToken });

      return await user.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "There was an error while signing in user",
        500
      );
    }
  }

  // signOut method to sign out user and remove token
  async signOut(userID, jwtToken) {
    try {
      const user = await UserModel.findById(userID);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
      user.loginSessions = user.loginSessions.filter(
        (token) => token.token !== jwtToken
      );

      return await user.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "There was an error while signing out user",
        500
      );
    }
  }

  // signOutAll method to sign out user from all devices
  async signOutAll(userID) {
    try {
      const user = await UserModel.findById(userID);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
      user.loginSessions = [];

      return await user.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "There was an error while signing out user",
        500
      );
    }
  }

  // validReq method to validate token
  async validReq(userID, jwtToken) {
    try {
      const user = await UserModel.findById(userID);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
      const validToken = user.loginSessions.find(
        (token) => token.token === jwtToken
      );
      return validToken ? true : false;
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "There was an error while validating token",
        500
      );
    }
  }

  // getUserDetails method to get user details by id
  async getUserDetails(userID) {
    try {
      const user = await UserModel.findById(userID)
        .select("-password -loginSessions")
        .lean();

      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
      return user;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("There was an error while fetching user", 500);
    }
  }

  // getAllUsers method to get all users
  async getAllUsers() {
    try {
      return await UserModel.find({}).select("-password -loginSessions").lean();
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "There was an error while fetching users",
        500
      );
    }
  }

  // check if user exists
  async checkUserExists(userID) {
    try {
      return await UserModel.findById(userID);
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "There was an error seeing if user exists",
        500
      );
    }
  }

  async resetPassword(userID, password) {
    try {
      const user = await UserModel.findById(userID);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
      user.password = password;

      await user.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "There was an error while signing out user",
        500
      );
    }
  }

  async updateUser(userID, bio, profilePicture) {
    try {
      const user = await UserModel.findById(userID);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }

      if (bio) user.bio = bio;

      if (profilePicture) user.profilePicture = profilePicture;

      return await user.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError(
        "There was an error while signing out user",
        500
      );
    }
  }
}
