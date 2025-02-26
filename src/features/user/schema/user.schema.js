import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must be at least 3 characters"],
    maxLength: [50, "Name must be at most 50 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be at least 8 characters"],
  },
  gender: {
    type: String,
    enum: ["F", "M", "O", "NS"],
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
  bio: {
    type: String,
    maxLength: [200, "Bio must be at most 200 characters"],
  },
  loginSessions: [
    {
      token: {
        type: String,
      },
    },
  ],
});

export default userSchema;
