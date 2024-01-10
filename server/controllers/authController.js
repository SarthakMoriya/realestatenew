import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const h_password = await bcrypt.hash(password, 12);

    const newUser = new User({ username, email, password: h_password });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    res.statusCode = 500;
    res.message = error.message;
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const isValidPassword = await bcrypt.compare(password, validUser.password);
    console.log(isValidPassword);
    if (!isValidPassword) {
      return next(errorHandler(404, "Invalid Credentials"));
    }

    const token = jwt.sign({ email,id:validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ email: user.email,id:user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = new User({
        password: hashedPassword,
        email: req.body.email,
        avatar:req.body.photo,
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
      });

      await newUser.save();
      const token = jwt.sign({ email: newUser.email,id:newUser._id }, process.env.JWT_SECRET);

      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout=(req,res,next)=>{
  try {
    res.clearCookie("access_token")
    res.send("SUCCESS")
  } catch (error) {
    next(error)
  }
}