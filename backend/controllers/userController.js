import userModel from "../models/userModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const post_signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    // create a new user in the database
    // hash the password
    const hashedPassword = await argon2.hash(password);
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
    // send the jwt in the cookie
    res.cookie("auth_token", generateToken({ id: newUser._id, email }), {
      httpOnly: true, // cannot be accessed by the script and reduce the risk of XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "User added successfully",
      id: newUser._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const post_login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // check if the password is correct
    const isPasswordCorrect = await argon2.verify(user.password, password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // send the jwt in the cookie
    res.cookie("auth_token", generateToken({ id: user._id, email }), {
      httpOnly: true, // cannot be accessed by the script and reduce the risk of XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.status(200).json({ message: "Sign in success", id: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const get_logout = async (_req, res) => {
  // clear the cookie
  try {
    res.clearCookie("auth_token");
    res.status(200).json({ message: "Sign out success" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const get_user_profile_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    // console.log(user);
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

};

export const update_user_profile_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    // body has updated data, use it to update the user
    const updatedFields = {};
    if (req.body.username) {
      updatedFields.username = req.body.username;
    }
    if (req.body.email) {
      updatedFields.email = req.body.email;
    }
    if (req.body.password) {
      const newPassword = await argon2.hash(req.body.password)
      updatedFields.password = newPassword; 
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updatedFields,  { new: true });
    // console.log(updatedUser);
    res.status(200).json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      created_at: updatedUser.created_at,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
