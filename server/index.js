import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./utils/ConnectionDB.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import listingRouter from "./routes/propertyRouter.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "INTERNAL SERVER ERROR";
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server listening on port:" + process.env.PORT);
  connectDB();
});
