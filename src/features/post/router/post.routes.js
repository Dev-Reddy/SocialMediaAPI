import express from "express";
import PostController from "../controller/post.controller.js";

import upload from "../../../utils/fileUpload.js";

const postRouter = express.Router();

const postController = new PostController();

postRouter.get("/user/:userId", (req, res, next) => {
  postController.getPostsByUser(req, res, next);
});

postRouter.get("/all", (req, res, next) => {
  postController.getAllPosts(req, res, next);
});

postRouter.get("/:postId", (req, res, next) => {
  postController.getPostById(req, res, next);
});

postRouter.delete("/:postId", (req, res, next) => {
  postController.deletePost(req, res, next);
});

postRouter.put("/:postId", upload.single("image"), (req, res, next) => {
  postController.updatePost(req, res, next);
});

postRouter.post("/", upload.single("image"), (req, res, next) => {
  postController.createNewPost(req, res, next);
});

export default postRouter;
