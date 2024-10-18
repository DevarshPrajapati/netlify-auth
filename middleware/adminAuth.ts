import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../src/model/userModel";
import { tokenBlacklist } from "../utils/blacklist";

const verifyAdminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "Unauthorized API request." });
    }
    if (tokenBlacklist.includes(token)) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized API request.",
      });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT!);
    const adminData = await userModel.findOne({ token: token });
    if (!adminData) {
      return res
        .status(401)
        .json({ status: false, message: "Unauthorized API request." });
    }
    req.body.adminDecoded = decodedToken;
    next();
  } catch (error) {
    console.error("Token error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Unauthorized API request." });
  }
};

export default verifyAdminAuth;
