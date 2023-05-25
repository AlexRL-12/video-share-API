import passport from "passport";
import {
  configureJwtStrategy,
  generateToken,
  authenticateJwt,
} from "../middleware/jwtUtils";
import { User, Video } from "../models";
import mongoose from "mongoose";

import { validateEmail, validatePassword } from "../middleware/validations";

// Configura la estrategia de passport-jwt
configureJwtStrategy();

export const signUp = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      email,
      password,
      repeatPassword,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with the same email already exists" });
    }

    // Create a new user instance with the provided data
    const newUser = new User({
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      email,
      password,
      repeatPassword,
    });

    const missingFields =
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !phoneNumber ||
      !email ||
      !password ||
      !repeatPassword;

    if (missingFields) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const passwordValidationResult = validatePassword(password);
    if (passwordValidationResult) {
      return res.status(400).json({ message: passwordValidationResult });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "The provided email is invalid" });
    }
    if (password !== repeatPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Encrypt the password
    newUser.password = await User.encryptPassword(password);

    // Save the user in the database
    const savedUser = await newUser.save();

    // Generate a token
    const payload = { userId: savedUser.id };
    const token = generateToken(payload);

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const signIn = (req, res, next) => {
  passport.authenticate("signin", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Authentication Error" });
    }

    const payload = { userId: user.id };
    const token = generateToken(payload);

    res.json({ token });
  })(req, res, next);
};

export const updateUser = (req, res, next) => {
  authenticateJwt(req, res, async () => {
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      email,
      password,
      repeatPassword,
    } = req.body;

    const missingFields =
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !phoneNumber ||
      !email ||
      !password ||
      !repeatPassword;

    if (missingFields) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with the same email already exists" });
    }

    const passwordValidationResult = validatePassword(password);
    if (passwordValidationResult) {
      return res.status(400).json({ message: passwordValidationResult });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "The provided email is invalid" });
    }
    if (password !== repeatPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.dateOfBirth = dateOfBirth;
      user.phoneNumber = phoneNumber;
      user.email = email;
      user.password = password;
      user.repeatPassword = repeatPassword;

      await user.save();

      res.json({ message: "User updated successfully" });
    } catch (error) {
      next(error);
    }
  });
};

export const deleteUser = (req, res, next) => {
  authenticateJwt(req, res, () => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "invalid user id" });
    }

    User.findByIdAndRemove(userId, (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    });
  });
};

export const logout = (req, res) => {
  req.logout();
  res.json({ message: "The session is closed" });
};

export const getUserVideos = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      authenticateJwt(req, res, resolve);
    });

    const userId = req.params.userId;
    const userVideos = await Video.find({ user: userId });

    if (userVideos.length === 0) {
      return res
        .status(404)
        .json({
          error: "No videos found for the specified user",
        });
    }

    res.status(200).json({ videos: userVideos });
  } catch (error) {
    res.status(500).json({ error: "Error getting user's videos" });
  }
};
