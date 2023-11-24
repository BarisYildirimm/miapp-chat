import User from "../models/userModel.js";
import { generateToken, tokenJWT } from "../utils/generateToken.js";
import { generateRandomString } from "../utils/generateRandom.js";

export const authUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userId: user.userId,
      token: tokenJWT,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or Password");
  }
};

export const register = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    userId: `${name}#${generateRandomString()}`,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userId: `${name}#${generateRandomString()}`,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data!");
  }
};

export const searchUser = async (req, res) => {
  try {
    const users = await User.find({ userId: { $regex: req.query.search } });
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};
