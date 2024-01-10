import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(
      process.env.MONGODB_URL.replace(
        "<password>",
        process.env.MONGODB_PASSWORD
      )
    )
    .then(() => {
      console.log("DB Connected Successfully!");
    });
};

export default connectDB;