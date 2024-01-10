import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listingModel.js";

export const updateUser = async (req, res, next) => {
  console.log(req.user.id, req.params.id);
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can only update you own account"));

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({ rest });
  } catch (error) {
    next(errorHandler(401, "You can only update your own account"));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You can only delete your own account"));
    }
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Delete Account Success", ok: true })
      .clearCookie("access_token");
  } catch (error) {
    next(errorHandler(401, "You can only delete you own account"));
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, "You can get only your listings"));
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(errorHandler(401, "You can get only your listings"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(401, "User Details Not Found"));
    }
    console.log(user._doc)
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
