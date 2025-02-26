import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserRepository from "../features/user/repository/user.repository.js";

dotenv.config();

const userRepository = new UserRepository();

const jwtAuth = async (req, res, next) => {
  //1. Read the token
  const token = req.headers["authorization"];

  //2. if no token, return the error

  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  //3. check if the token is valid
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const validLReq = await userRepository.validReq(payload.userID, token);

    if (!validLReq) {
      return res.status(401).send("Unauthorized. Please login again");
    }

    req.userID = payload.userID;
    req.email = payload.email;
  } catch (error) {
    //4. if the token is invalid, return the error
    console.log(error);
    return res.status(401).send("Unauthorized");
  }

  //5. if the token is valid, call next()
  next();
};

export default jwtAuth;
