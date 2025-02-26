import express from "express";
import FriendsController from "../controller/friends.controller.js";

const friendsRouter = express.Router();

const friendsController = new FriendsController();

friendsRouter.get("/get-friends/:userID", (req, res, next) => {
  friendsController.getFriends(req, res, next);
});

friendsRouter.get("/get-pending-requests", (req, res, next) => {
  friendsController.getRequests(req, res, next);
});

friendsRouter.post("/toggle-friendship/:friendID", (req, res, next) => {
  friendsController.toggleFriendship(req, res, next);
});

friendsRouter.post("/response-to-request/:friendID", (req, res, next) => {
  friendsController.responseToRequest(req, res, next);
});

export default friendsRouter;
