import userModel from "../models/userModel";

export const addUser = async (req, res) => {
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



