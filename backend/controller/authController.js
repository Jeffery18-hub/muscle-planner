import userModel from "../models/userModel";

export const post_signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new userModel({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User added successfully" });
  } catch (error) { 
    res.status(500).json({ message: "Server error" });
  } 
};

export const post_signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    res.status(200).json({ message: "Sign in success" });
  } catch (error) { 
    res.status(500).json({ message: "Server error" });
  } 
}