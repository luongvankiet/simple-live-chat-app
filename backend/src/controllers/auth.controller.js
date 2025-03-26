import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJWTToken } from "../lib/utils.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import cloudinary from "../lib/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { email, fullName, password } = await registerSchema.validateAsync(
      req.body
    );

    // hash password
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    } else {
      // generate jwt token
      generateJWTToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        success: true,
        data: {
          _id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          profileImage: newUser.profileImage,
        },
      });
    }
  } catch (error) {
    console.error("Error in registering user:", error.message);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = await loginSchema.validateAsync(req.body);

    console.log(email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // generate jwt token
    generateJWTToken(user._id, res);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error in logging in user:", error.message);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      res.status(401).json({ success: false, message: "Unauthenticated" });
    }

    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "User logged out" });
  } catch (error) {
    console.error("Error in logging out user:", error.message);
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profileImage } = req.body;
    const userId = req.user._id;

    if (!profileImage) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profileImage);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profileImage: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.log("Error in updating profile: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
