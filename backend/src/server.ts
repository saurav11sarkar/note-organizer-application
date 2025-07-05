import mongoose from "mongoose";
import config from "./config";
import app from "./app";

const port = config.PORT;

const main = async () => {
  try {
    await mongoose.connect(config.MONGO_URI as string);
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`server is runningon port http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
