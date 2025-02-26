import express from "express";
import swagger from "swagger-ui-express";
import userRouter from "./src/features/user/router/user.routes.js";
import postRouter from "./src/features/post/router/post.routes.js";
import commentRouter from "./src/features/comment/router/comment.routes.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import likeRouter from "./src/features/like/router/like.routes.js";
import friendsRouter from "./src/features/friends/router/friends.routes.js";
import otpRouter from "./src/features/otp/router/otp.routes.js";
import { ApplicationError } from "./src/error/applicationError.js";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import apiDocs from "./swagger.json" with {type: "json"};

const app = express();

// middleware to parse the request body
app.use(express.json());

// logger middleware
app.use(loggerMiddleware);

// User routes
app.use("/api/users", userRouter);

// Post routes
app.use("/api/posts", jwtAuth, postRouter);

// Comment routes
app.use("/api/comments", jwtAuth, commentRouter);

// Like routes
app.use("/api/likes", jwtAuth, likeRouter);

// Friends routes
app.use("/api/friends", jwtAuth, friendsRouter);

// OTP routes
app.use("/api/otp", otpRouter);

// serve the API documentation
app.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

app.get("/", (req, res) => {
  res.send("Welcome to the Post Away API");
});

// Middleware to handle 404 error
app.use((req, res) => {
  res
    .status(404)
    .send("API not found. Please check the documentation at /api-docs");
});

// Error handling middleware

app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof ApplicationError) {
    res.status(err.code).send(err.message);
  }

  res.status(500).send("Something went wrong. PLease try again later.");
});

export default app;
