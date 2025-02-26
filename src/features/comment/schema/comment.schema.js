import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },

  text: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default commentSchema;
