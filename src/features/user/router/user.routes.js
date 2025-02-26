import express from "express";
import UserController from "../controller/user.controller.js";
import jwtAuth from "../../../middlewares/jwt.middleware.js";
import upload from "../../../utils/fileUpload.js";

const userRouter = express.Router();

const userController = new UserController();

userRouter.post("/signup", upload.single("profilePicture"), (req, res) => {
  userController.signUp(req, res);
});

userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});

userRouter.post("/logout", jwtAuth, (req, res) => {
  userController.signOut(req, res);
});

userRouter.post("/logout-all-devices", jwtAuth, (req, res) => {
  userController.signOutAll(req, res);
});

userRouter.get("/get-details/:userId", jwtAuth, (req, res) => {
  userController.getUserDetails(req, res);
});

userRouter.get("/get-all-details", jwtAuth, (req, res) => {
  userController.getAllUsers(req, res);
});

userRouter.put(
  "/update-details",
  jwtAuth,
  upload.single("profilePicture"),
  (req, res) => {
    userController.updateUser(req, res);
  }
);

export default userRouter;
