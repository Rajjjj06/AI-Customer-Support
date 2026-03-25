import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwt_secret = process.env.JWT_SECRET;

export const generateToken = (payload) => {
  return jwt.sign(payload, jwt_secret, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, jwt_secret);
};

export const decodeToken = (token) => {
  return jwt.decode(token, jwt_secret);
};
