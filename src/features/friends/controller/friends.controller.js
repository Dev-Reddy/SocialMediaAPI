import FriendsRepository from "../repository/friends.repository.js";

export default class FriendsController {
  constructor() {
    this.friendsRepository = new FriendsRepository();
  }

  async getFriends(req, res, next) {
    try {
      const { userID } = req.params;

      const friends = await this.friendsRepository.getFriends(userID);

      return res.status(200).send({
        message: "All friends of the user",
        friends,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }

  async getRequests(req, res, next) {
    try {
      const userID = req.userID;

      const requests = await this.friendsRepository.getRequests(userID);

      return res.status(200).send({
        message: "All pending requests of the user",
        requests,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }
  async toggleFriendship(req, res, next) {
    try {
      const userID = req.userID;
      const { friendID } = req.params;

      const action = await this.friendsRepository.toggleFriendship(
        userID,
        friendID
      );

      return res.status(200).send({
        message: "Friendship Toggled",
        action,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }
  async responseToRequest(req, res, next) {
    try {
      const { response } = req.body;
      const userID = req.userID;
      const { friendID } = req.params;

      if (response == "accept") {
        const acc = this.friendsRepository.acceptRequest(userID, friendID);
        return res.status(200).send({
          message: "Request Accepted",
        });
      } else if (response == "reject") {
        const rej = this.friendsRepository.rejectRequest(userID, friendID);
        return res.status(200).send({
          message: "Request Rejected",
        });
      } else {
        return res.status(200).send({
          message:
            "Inappropriate Response. Either 'accept' or 'reject' the request",
        });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(err.code || 500)
        .send(err.message || "There was some problem. Please try again.");
    }
  }
}
