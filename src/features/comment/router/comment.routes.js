import express from "express";
import CommentController from "../controller/comment.controller.js";

const commentRouter = express.Router();

const commentController = new CommentController();

commentRouter.get("/:postID", (req, res, next) => {
  commentController.getAllCommentsForPost(req, res, next);
});

commentRouter.post("/:postID", (req, res, next) => {
  commentController.addComment(req, res, next);
});

commentRouter.put("/:commentID", (req, res, next) => {
  commentController.editComment(req, res, next);
});

commentRouter.delete("/:commentID", (req, res, next) => {
  commentController.deleteComment(req, res, next);
});

export default commentRouter;
