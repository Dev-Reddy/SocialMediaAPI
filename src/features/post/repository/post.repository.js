import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import postSchema from "../schema/post.schema.js";
import UserRepository from "../../user/repository/user.repository.js";
import { ApplicationError } from "../../../error/applicationError.js";

// creating post model from post schema
const PostModel = mongoose.model("Post", postSchema);

// userRepository for user methods
const userRepository = new UserRepository();

// PostRepository class
export default class PostRepository {
  // get all posts

  // get post by id
  async getAllPosts() {
    try {
      const posts = await PostModel.find({}).lean();
      if (!posts) {
        throw new ApplicationError("No Posts exist", 404);
      }

      return posts;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }

      throw new ApplicationError(
        "There was an error while retreiving all posts",
        500
      );
    }
  }

  // get post by id
  async getPostById(postID) {
    try {
      const post = await PostModel.findById(postID).lean();
      if (!post) {
        throw new ApplicationError("Post does not exist", 404);
      }

      return post;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }

      if (err.message === "Post does not exist") {
        throw new ApplicationError("Post does not exist", 404);
      }
      throw new ApplicationError(
        "There was an error while retreiving the post",
        500
      );
    }
  }

  // get user posts

  async getPostsByUser(userID) {
    try {
      const posts = await PostModel.find({ user: userID }).lean();

      const user = userRepository.checkUserExists(userID);

      if (!user) {
        throw new ApplicationError("User does not exist", 404);
      }

      if (!posts) {
        throw new ApplicationError("This user does not have any posts", 404);
      }

      return posts;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }

      throw new ApplicationError(
        "There was an error while retreiving the user's posts",
        500
      );
    }
  }

  async createNewPost(post, userID) {
    try {
      const newPost = new PostModel({
        ...post,
        user: new ObjectId(userID),
      });
      return await newPost.save();
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }

      throw new ApplicationError(
        "There was an error while creating the post",
        500
      );
    }
  }

  async deletePost(postID, userID) {
    try {
      const post = await PostModel.findById(postID).lean();
      if (!post) {
        throw new ApplicationError("Post does not exist", 404);
      }
      console.log("post", post);
      console.log("userID", userID);
      console.log("post.user", post.user);

      if (post.user != userID) {
        throw new ApplicationError(
          "You are not authorized to delete this post",
          404
        );
      }

      await PostModel.deleteOne({ _id: postID });
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }

      throw new ApplicationError(
        "There was an error while deleting the post",
        500
      );
    }
  }

  async updatePost(updatedPost, userID, postID) {
    try {
      let post = await PostModel.findById(postID).lean();
      if (!post) {
        throw new ApplicationError("Post does not exist", 404);
      }

      if (post.user != userID) {
        throw new ApplicationError(
          "You are not authorized to delete this post",
          404
        );
      }

      post.caption = updatedPost.caption;

      post.image = updatedPost.image?.data ? updatedPost.image : post.image;

      return await PostModel.findByIdAndUpdate(postID, post, {
        returnDocument: "after",
      }).lean();
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }

      throw new ApplicationError(
        "There was an error while updating the post",
        500
      );
    }
  }

  async addComment(comment) {
    try {
      let post = await PostModel.findById(comment.post).lean();
      if (!post) {
        throw new ApplicationError("Post does not exist", 404);
      }
      post.comments.push(comment._id);
      return await PostModel.findByIdAndUpdate(comment.post, post, {
        returnDocument: "after",
      }).lean();
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }

      throw new ApplicationError(
        "There was an error while updating the post",
        500
      );
    }
  }

  async deleteComment(comment) {
    try {
      let post = await PostModel.findById(comment.post).lean();
      if (!post) {
        throw new ApplicationError("Post does not exist", 404);
      }
      return await PostModel.updateOne(
        { _id: comment.post },
        { $pull: { comments: comment._id } },
        {
          returnDocument: "after",
        }
      ).lean();
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }

      throw new ApplicationError(
        "There was an error while updating the post",
        500
      );
    }
  }

  async toggleLike(userID, postID) {
    try {
      const post = await this.getPostById(postID);

      if (!post) {
        throw new ApplicationError("Post does not exist", 404);
      }

      const index = post.likes.findIndex((id) => id.toString() === userID);

      if (index === -1) {
        post.likes.push(new ObjectId(userID));
        return await PostModel.findByIdAndUpdate(postID, post, {
          returnDocument: "after",
        }).lean();
      }

      post.likes = post.likes.filter((user) => user.toString() != userID);
      return await PostModel.findByIdAndUpdate(postID, post, {
        returnDocument: "after",
      }).lean();
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("There was an error adding the like", 500);
    }
  }

  async getPostLikes(postID) {
    try {
      const post = await this.getPostById(postID);

      if (!post) {
        throw new ApplicationError("Post does not exist", 404);
      }

      return post.likes;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError("There was an error getting post likes", 500);
    }
  }
}
