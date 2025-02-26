import PostRepository from "../repository/post.repository.js";

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  // get all posts
  async getAllPosts(req, res, next) {
    try {
      let posts = await this.postRepository.getAllPosts();

      posts = posts.map((post) => ({
        ...post,
        image: post.image?.data
          ? {
              data: `data:${
                post.image.contentType
              };base64,${post.image.data.toString("base64")}`,
              contentType: post.image.contentType,
            }
          : null,
      }));

      return res.status(200).send({
        message: "All Posts",
        posts,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }

  async getPostById(req, res, next) {
    try {
      const { postId } = req.params;
      const post = await this.postRepository.getPostById(postId);
      return res.status(200).send({
        message: "The specified post",
        post: {
          ...post,
          image: post.image?.data
            ? {
                data: `data:${
                  post.image.contentType
                };base64,${post.image.data.toString("base64")}`,
                contentType: post.image.contentType,
              }
            : null,
        },
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }

  async getPostsByUser(req, res, next) {
    try {
      const { userId } = req.params;
      let posts = await this.postRepository.getPostsByUser(userId);

      posts = posts.map((post) => ({
        ...post,
        image: post.image?.data
          ? {
              data: `data:${
                post.image.contentType
              };base64,${post.image.data.toString("base64")}`,
              contentType: post.image.contentType,
            }
          : null,
      }));
      return res.status(200).send({
        message: "The posts from the user",
        posts,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }

  async createNewPost(req, res, next) {
    try {
      const userID = req.userID;
      let { caption } = req.body;

      const post = await this.postRepository.createNewPost(
        {
          caption,
          image: {
            data: req.file?.buffer,
            contentType: req.file?.mimetype,
          },
        },
        userID
      );

      post.image = post.image?.data
        ? {
            data: `data:${
              post.image.contentType
            };base64,${post.image.data.toString("base64")}`,
            contentType: post.image.contentType,
          }
        : null;
      return res.status(201).send({
        message: "Post has been created",
        post,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }

  async deletePost(req, res, next) {
    try {
      const userID = req.userID;
      const { postId } = req.params;

      await this.postRepository.deletePost(postId, userID);

      return res.status(201).send({
        message: "Post has been deleted",
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }

  async updatePost(req, res, next) {
    try {
      const userID = req.userID;
      const { postId } = req.params;
      let { caption } = req.body;

      const post = await this.postRepository.updatePost(
        {
          caption,
          image: {
            data: req.file?.buffer,
            contentType: req.file?.mimetype,
          },
        },
        userID,
        postId
      );

      return res.status(200).send({
        message: "Post has been updated",
        post: {
          ...post,
          image: post.image?.data
            ? {
                data: `data:${
                  post.image.contentType
                };base64,${post.image.data.toString("base64")}`,
                contentType: post.image.contentType,
              }
            : null,
        },
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }
}
