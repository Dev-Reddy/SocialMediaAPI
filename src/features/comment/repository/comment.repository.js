import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import commentSchema from "../schema/comment.schema.js";
import PostRepository from "../../post/repository/post.repository.js";
import { ApplicationError } from "../../../error/applicationError.js";

// creating comment model from comment schema
const CommentModel = mongoose.model("Comment", commentSchema);

// postRepository for post methods
const postRepository = new PostRepository();

// CommentRepository class
export default class CommentRepository {
  async addComment(text, postID, userID) {
    try {
      const post = await postRepository.getPostById(postID);

      if (!post) {
        throw new ApplicationError("Post does not exist", 404);
      }

      const newComment = new CommentModel({
        postOwner: post.user,
        commenter: new ObjectId(userID),
        post: new ObjectId(postID),
        text,
      });

      await newComment.save();

      await postRepository.addComment(newComment);

      return newComment;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("There was an error adding the comment", 500);
    }
  }

  async editComment(text, commentID, userID) {
    try {
      let comment = await CommentModel.findById(commentID);

      if (!comment) {
        throw new ApplicationError("This comment does not exist", 404);
      }

      if (comment.commenter != userID) {
        throw new ApplicationError(
          "You cannot edit this comment as this is not yours",
          404
        );
      }

      comment.text = text;

      return await CommentModel.findByIdAndUpdate(commentID, comment, {
        returnDocument: "after",
      }).lean();
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("There was an error adding the comment", 500);
    }
  }

  async deleteComment(commentID, userID) {
    try {
      let comment = await CommentModel.findById(commentID);

      if (!comment) {
        throw new ApplicationError("This comment does not exist", 404);
      }
      if (comment.commenter != userID || comment.postOwner != userID) {
        throw new ApplicationError("You cannot delete this comment", 404);
      }

      await postRepository.deleteComment(comment);

      await CommentModel.deleteOne({ _id: commentID });
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("There was an error adding the comment", 500);
    }
  }

  async getAllCommentsForPost(postID) {
    try {
      const post = await postRepository.getPostById(postID);

      if (!post) {
        throw new ApplicationError("Post does not exist", 404);
      }

      const comments = await CommentModel.find({
        _id: { $in: post.comments },
      });

      return comments;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("There was an error adding the comment", 500);
    }
  }

  async toggleLike(userID, commentID) {
    try {
      const comment = await CommentModel.findById(commentID).lean();

      if (!comment) {
        throw new ApplicationError("Comment does not exist", 404);
      }

      const index = comment.likes.findIndex((id) => id.toString() === userID);

      if (index === -1) {
        comment.likes.push(new ObjectId(userID));
        return await CommentModel.findByIdAndUpdate(commentID, comment, {
          returnDocument: "after",
        }).lean();
      }

      comment.likes = comment.likes.filter((user) => user.toString() != userID);
      return await CommentModel.findByIdAndUpdate(commentID, comment, {
        returnDocument: "after",
      }).lean();
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("There was an error liking the comment", 500);
    }
  }

  async getCommentLikes(commentID) {
    try {
      const comment = await CommentModel.findById(commentID).lean();

      if (!comment) {
        throw new ApplicationError("Comment does not exist", 404);
      }
      return comment.likes;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(
        "There was an error getting comment likes",
        500
      );
    }
  }
}
