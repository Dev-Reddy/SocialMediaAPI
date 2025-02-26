import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import friendsSchema from "../schema/friends.schema.js";
import { ApplicationError } from "../../../error/applicationError.js";
import UserRepository from "../../user/repository/user.repository.js";

// creating post model from post schema
const FriendsModel = mongoose.model("Friends", friendsSchema);

const userRepository = new UserRepository();

// FriendsRepository class
export default class FriendsRepository {
  async getFriends(userID) {
    try {
      const user = userRepository.checkUserExists(userID);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
      const friends = await FriendsModel.find({ user: userID }).lean();
      if (!friends) {
        const newFriends = new FriendsModel({
          user: new ObjectId(userID),
        });
        await newFriends.save();
        return newFriends.friends;
      }

      return friends.friends;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(
        "There was an error getting friends for the user",
        500
      );
    }
  }

  async getRequests(userID) {
    try {
      const user = userRepository.checkUserExists(userID);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
      const friends = await FriendsModel.find({ user: userID }).lean();
      if (!friends) {
        const newFriends = new FriendsModel({
          user: new ObjectId(userID),
        });
        await newFriends.save();
        return newFriends.requests;
      }

      return friends.requests;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(
        "There was an error getting friend requests for the user",
        500
      );
    }
  }

  async toggleFriendship(userID, friendID) {
    try {
      const user = userRepository.checkUserExists(userID);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }

      const friend = userRepository.checkUserExists(friendID);
      if (!friend) {
        throw new ApplicationError("User not found", 404);
      }
      const friends1 = await FriendsModel.find({ user: userID }).lean();
      if (!friends1) {
        const newFriends = new FriendsModel({
          user: new ObjectId(userID),
        });
        await newFriends.save();
      }

      const friends2 = await FriendsModel.find({ user: friendID }).lean();
      if (!friends2) {
        const newFriends = new FriendsModel({
          user: new ObjectId(friendID),
        });
        await newFriends.save();
      }

      const areFriends = friends1.friends.findIndex(
        (f) => f.toString() == friendID
      );

      //   not already friends
      //   we need to  send the requests
      //   ADD FRIEND FUNCTIONALITY
      if (areFriends === -1) {
        // check if user 1 has sent request to the friend

        const requestSent = friends2.requests.findIndex(
          (f) => f.toString() == userID
        );

        // no request was sent
        // so send one now
        // THIS ADDS FRIENDS
        if (requestSent === -1) {
          friends2.requests.push(new ObjectId(userID));
          // return await FriendsModel.findByIdAndUpdate(friends2._id, friends2, {
          //   returnDocument: "after",
          // });
          return "Request Sent";
        }
      }
      //are already friends so remove it
      else {
        const f1 = friends1.friends.findIndex((f) => f.toString() == friendID);
        const f2 = friends2.friends.findIndex((f) => f.toString() == userID);

        friends1.friends.splice(f1, 1);
        friends2.friends.splice(f2, 1);
        const newFriends1 = await FriendsModel.findByIdAndUpdate(
          friends1._id,
          friends1,
          {
            returnDocument: "after",
          }
        );

        const newFriends2 = await FriendsModel.findByIdAndUpdate(
          friends2._id,
          friends2,
          {
            returnDocument: "after",
          }
        );

        return "Friendship Removed";
      }
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(
        "There was an error getting friend requests for the user",
        500
      );
    }
  }

  async acceptRequest(userID, friendID) {
    try {
      const user = userRepository.checkUserExists(userID);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }

      const friend = userRepository.checkUserExists(friendID);
      if (!friend) {
        throw new ApplicationError("User not found", 404);
      }
      const friends1 = await FriendsModel.find({ user: userID }).lean();
      if (!friends1) {
        const newFriends = new FriendsModel({
          user: new ObjectId(userID),
        });
        await newFriends.save();
      }

      const friends2 = await FriendsModel.find({ user: friendID }).lean();
      if (!friends2) {
        const newFriends = new FriendsModel({
          user: new ObjectId(friendID),
        });
        await newFriends.save();
      }

      // accept the request of the friend if it is there

      const index = friends1.requests.findIndex(
        (f) => f.toString() == friendID
      );

      //  if no request
      if (index === -1) {
        throw new ApplicationError("No such request to accept", 404);
      }

      // accept request

      // remove request from the requests
      friends1.requests.splice(index, 1);

      // add them to each others friends lists

      friends1.friends.push(new ObjectId(friendID));

      const updatedUser = await FriendsModel.findByIdAndUpdate(
        friends1._id,
        friends1,
        {
          returnDocument: "after",
        }
      );

      friends2.friends.push(new ObjectId(userID));

      await FriendsModel.findByIdAndUpdate(friends2._id, friends2);

      return updatedUser;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(
        "There was an error sending the friend request to the user",
        500
      );
    }
  }

  async rejectRequest(userID, friendID) {
    try {
      const user = userRepository.checkUserExists(userID);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }

      const friend = userRepository.checkUserExists(friendID);
      if (!friend) {
        throw new ApplicationError("User not found", 404);
      }
      const friends1 = await FriendsModel.find({ user: userID }).lean();
      if (!friends1) {
        const newFriends = new FriendsModel({
          user: new ObjectId(userID),
        });
        await newFriends.save();
      }

      const friends2 = await FriendsModel.find({ user: friendID }).lean();
      if (!friends2) {
        const newFriends = new FriendsModel({
          user: new ObjectId(friendID),
        });
        await newFriends.save();
      }

      // accept the request of the friend if it is there

      const index = friends1.requests.findIndex(
        (f) => f.toString() == friendID
      );

      //  if no request
      if (index === -1) {
        throw new ApplicationError("No such request to accept", 404);
      }

      // remove request from the requests
      friends1.requests.splice(index, 1);

      const updatedUser = await FriendsModel.findByIdAndUpdate(
        friends1._id,
        friends1,
        {
          returnDocument: "after",
        }
      );

      return updatedUser;
    } catch (err) {
      console.log(err);
      if (err instanceof ApplicationError) {
        throw err;
      }
      throw new ApplicationError(
        "There was an error sending the friend request to the user",
        500
      );
    }
  }
}
