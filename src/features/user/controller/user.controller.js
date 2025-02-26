import jwt from "jsonwebtoken";
import UserRepository from "../repository/user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res) {
    try {
      let user = req.body;
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      user.profilePicture = {
        data: req.file?.buffer,
        contentType: req.file?.mimetype,
      };
      const newUser = await this.userRepository.signUp(user);
      res.status(201).json(newUser);
    } catch (err) {
      console.log(err);
      res.status(err.code || 500).json({ message: err.message });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userID: user._id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "2 days",
        }
      );

      await this.userRepository.signIn(user._id, token);

      res.status(200).json({ token });
    } catch (err) {
      console.log(err);
      res.status(err.code || 500).json({ message: err.message });
    }
  }

  async signOut(req, res) {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res
          .status(400)
          .json({ message: "Token is required. Please login again." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      await this.userRepository.signOut(decoded.userID, token);

      res.status(200).json({ message: "User signed out successfully" });
    } catch (err) {
      console.log(err);
      res.status(err.code || 500).json({ message: err.message });
    }
  }

  async signOutAll(req, res) {
    try {
      const token = req.headers["authorization"];
      if (!token) {
        return res
          .status(400)
          .json({ message: "Token is required. Please login again." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      await this.userRepository.signOutAll(decoded.userID);

      res.status(200).json({ message: "User signed out from all devices" });
    } catch (err) {
      console.log(err);
      res.status(err.code || 500).json({ message: err.message });
    }
  }

  async getUserDetails(req, res) {
    try {
      const { userId } = req.params;
      let user = await this.userRepository.getUserDetails(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        ...user,
        profilePicture: user.profilePicture?.data
          ? {
              data: `data:${
                user.profilePicture.contentType
              };base64,${user.profilePicture.data.toString("base64")}`,
              contentType: user.profilePicture.contentType,
            }
          : null,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }

  async getAllUsers(req, res) {
    try {
      let users = await this.userRepository.getAllUsers();

      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      users = users.map((user) => ({
        ...user,
        profilePicture: user.profilePicture?.data
          ? {
              data: `data:${
                user.profilePicture.contentType
              };base64,${user.profilePicture.data.toString("base64")}`,
              contentType: user.profilePicture.contentType,
            }
          : null,
      }));

      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  }

  async updateUser(req, res) {
    try {
      const { bio } = req.body;
      const profilePicture = {
        data: req.file?.buffer,
        contentType: req.file?.mimetype,
      };

      console.log("bio ", bio);
      console.log("profilePicture");

      const userID = req.userID;

      const updatedUser = await this.userRepository.updateUser(
        userID,
        bio,
        profilePicture
      );

      res.status(201).json({
        message: "User updated",
      });
    } catch (err) {
      console.log(err);
      res.status(err.code || 500).json({ message: err.message });
    }
  }
}
