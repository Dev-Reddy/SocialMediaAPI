import { LikeRepository } from "../repository/like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async toggleLike(req, res, next) {
    try {
      const { id } = req.params;
      const { type } = req.body;
      const userId = req.userID;
      if (type != "Post" && type != "Comment") {
        return res.status(400).send("Invalid type");
      }

      if (type == "Post") {
        this.likeRepository.togglePostLike(userId, id);
      } else {
        this.likeRepository.toggleCommentLike(userId, id);
      }

      return res.status(200).send({ message: `${type} toggled successfully` });
    } catch (error) {
      console.log("error", error);
      return res.status(500).send(error.message);
    }
  }

  async getLikes(req, res, next) {
    try {
      const { id } = req.params;
      const { type } = req.body;
      if (type != "Post" && type != "Comment") {
        return res.status(400).send("Invalid type");
      }
      let likes;
      if (type == "Post") {
        likes = await this.likeRepository.getPostLikes(id);
      } else {
        likes = await this.likeRepository.getCommentLikes(id);
      }

      return res.status(200).send({
        likedBy: likes,
        message: `Likes for the specified ${type}`,
      });
    } catch (error) {
      console.log("error", error);
      return res.status(500).send(error.message);
    }
  }
}
