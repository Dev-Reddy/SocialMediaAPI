import { ObjectId } from "mongodb";
import { ApplicationError } from "../../../error/applicationError.js";
import PostRepository from "../../post/repository/post.repository.js";
import CommentRepository from "../../comment/repository/comment.repository.js";

// postRepository for post methods
const postRepository = new PostRepository();

// commentRepository for post methods
const commentRepository = new CommentRepository();

export class LikeRepository {
  async togglePostLike(userID, postID) {
    try {
      const post = await postRepository.toggleLike(userID, postID);
      return post;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("There was an error liking the post", 500);
    }
  }

  async toggleCommentLike(userID, commentID) {
    try {
      const comment = await commentRepository.toggleLike(userID, commentID);

      return comment;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("There was an error liking the comment", 500);
    }
  }

  async getPostLikes(postID) {
    try {
      const likes = await postRepository.getPostLikes(postID);
      return likes;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(
        "There was an error getting the post likes",
        500
      );
    }
  }

  async getCommentLikes(postID) {
    try {
      const likes = await commentRepository.getCommentLikes(postID);

      return likes;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(
        "There was an error getting the comment likes",
        500
      );
    }
  }
}
