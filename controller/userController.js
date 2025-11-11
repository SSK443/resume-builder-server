import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/resume.js";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

//controller for user registration
//post: /api/users/register

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if rquired field are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "missing required fields" });
    }
    //check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }

//my
    //     // create new user
    // const hashedPassword = await bcrypt.hash(password, 10);

    // const newUser = await User.create({
    //   name,
    //   email,
    //   password: hashedPassword,
    // });


    //chat gpt

    // create new user
    const newUser = await User.create({
      name,
      email,
      password: password, // 👈 Pass the plain text password
    });

    //return success message
    const token = generateToken(newUser._id);
    newUser.password = "undefined";

    return res
      .status(201)
      .json({ message: "user created sucessfully", token, user: newUser });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


//controller for user login
//post: /api/users/login

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    //check if password is correct
    if (!user.comparePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //return success message

    const token = generateToken(user._id);
    user.password = "undefined";

    return res.status(200).json({ message: "Login successful", token, user});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
//controller for user by id
//post: /api/users/data

export const getUserById = async (req, res) => {
  try {
    const userId = req.userId;
    //check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //return user
    user.password = "undefined";
    return res.status(200).json({ message: "User found", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


//controller for getting user resumes
//get: /api/users/resumes

export const getUserResumes = async (req, res) => {
  try {
    const userId = req.userId;
    //return user resumes
    const resumes = await Resume.find({ userId });
    return res.status(200).json({ message: "Resumes found", resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};  