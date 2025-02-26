import CommentRepository from "../repository/comment.repository.js";

export default class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async addComment(req, res, next) {
    try {
      const { postID } = req.params;

      const userID = req.userID;

      const { comment } = req.body;

      const newComment = await this.commentRepository.addComment(
        comment,
        postID,
        userID
      );

      return res.status(201).send({
        message: "Comment has been added",
        comment: newComment,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }

  async editComment(req, res, next) {
    try {
      const { commentID } = req.params;

      const userID = req.userID;

      const { comment } = req.body;

      const updatedComment = await this.commentRepository.editComment(
        comment,
        commentID,
        userID
      );

      return res.status(200).send({
        message: "Comment has been updated",
        comment: updatedComment,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { commentID } = req.params;

      const userID = req.userID;

      await this.commentRepository.deleteComment(commentID, userID);

      return res.status(200).send({
        message: "Comment has been deleted",
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }

  async getAllCommentsForPost(req, res, next) {
    try {
      const { postID } = req.params;
      const comments = await this.commentRepository.getAllCommentsForPost(
        postID
      );
      return res.status(200).send({
        message: "Comments for the post",
        comments,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }
}
