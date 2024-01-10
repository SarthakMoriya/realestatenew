import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?w=900&t=st=1704202353~exp=1704202953~hmac=e80d8d03c5978fbccc70c6166f00a9c2a348f2951c63b077a905ebea611b3509",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
