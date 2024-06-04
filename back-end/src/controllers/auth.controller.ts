import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { ErrorResponse, UserDetails } from "../types/types.js";
import { createUser } from "./users.controller.js";
import { User } from "../models/users.model.js";
import {
  ERROR_IN_DATABASE,
  INVALID_AUTHORISATION,
  NO_SUCH_RESOURCE,
  OTP_SENT,
} from "../utility/constants.js";
import { Types } from "mongoose";
import hashPassword, { comparePassword } from "../utility/hashPassword.js";
import sendOtpMail from "../mailers/otp.mailer.js";
import OTP from "../models/otp.model.js";

type UserDetailsWithoutPassword = Omit<UserDetails, "password">;

// POST /auth/signup
const signUp = async (
  req: Request<{}, UserDetailsWithoutPassword | ErrorResponse, UserDetails>,
  res: Response<UserDetailsWithoutPassword | ErrorResponse>
) => {
  createUser(req, res);
};

// POST /auth/login
type UserDetailsWithId = UserDetailsWithoutPassword & { id: string };
type LoginDetails = {
  username: string;
  password: string;
};
const login = async (
  req: Request<{}, UserDetailsWithId | ErrorResponse, LoginDetails>,
  res: Response
) => {
  const { username, password } = req.body;

  let user;
  try {
    user = await User.findOne({ username: username });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: NO_SUCH_RESOURCE,
    });
  }

  const comparison: boolean = comparePassword(password, user.password);

  if (!comparison) {
    return res.status(401).json({
      status: 401,
      message: INVALID_AUTHORISATION,
    });
  }

  // Generate OTP and use Mailer to Send It
  const randomNumber = () => {
    return Math.floor(Math.random() * 9) + 1;
  };
  const otp =
    randomNumber() * 1000 +
    randomNumber() * 100 +
    randomNumber() * 10 +
    randomNumber();
  const otpString = otp.toString();

  const otpHashed: string = hashPassword(otpString);

  const newOtp = new OTP({
    otp: otpHashed,
    userId: user._id,
    createdAt: Date.now(),
    expiresAt: Date.now() + 300000,
  });

  try {
    await newOtp.save();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  sendOtpMail(otpString, user.email);

  return res.status(200).json({
    status: 200,
    message: OTP_SENT,
  });
};

const verifyOtp = async (req: Request, res: Response) => {
  const otp: string = req.body.otp;
  const id: string = req.body.id;

  let otp_db;
  try {
    otp_db = await OTP.findOne({ userId: new Types.ObjectId(id) });
    console.log(otp_db);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }
  if (!otp_db) {
    return res.status(404).json({
      status: 404,
      message: NO_SUCH_RESOURCE,
    });
  }

  if (!comparePassword(otp, otp_db.otp)) {
    return res.status(401).json({
      status: 401,
      message: INVALID_AUTHORISATION,
    });
  }

  // Build JSON Cookie

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: NO_SUCH_RESOURCE,
    });
  }

  const token = jwt.sign(
    {
      name: user.name,
      age: user.age,
      username: user.username,
      email: user.email,
      id: user.id,
      verificationStatus: user.verificationStatus,
    },
    process.env.JSON_SECRET!,
    { expiresIn: 60 * 60 }
  );

  res.cookie("token", token, { maxAge: 60 * 60, secure: true, httpOnly: true });

  return res.status(200).json({
    name: user.name,
    age: user.age,
    username: user.username,
    email: user.email,
    id: user.id,
    conversations: user.conversations,
    verificationStatus: user.verificationStatus,
  });
};

const logout = async (req: Request, res: Response) => {};

export { signUp, login, logout, verifyOtp };
