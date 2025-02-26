import app from "./index.js";
import dotenv from "dotenv";
import { connectUsingMongoose } from "./src/config/mongoose.config.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  connectUsingMongoose();
});
