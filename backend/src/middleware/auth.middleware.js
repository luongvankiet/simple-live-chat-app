import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const checkVerifiedToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated - No Token Provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in checking verified token: ", error.message);
    res.status(500).json({ message: "Internal server errorr" });
  }
};

export const getCurrentUser = (req, res) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    console.log("Error in check auth controller", error.message);
    res.status(500).json({ succes: false, message: "Internal server error" });
  }
};
