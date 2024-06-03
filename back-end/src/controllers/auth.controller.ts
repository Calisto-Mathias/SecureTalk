import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ErrorResponse, UserDetails } from "../types/types.js";
import { createUser } from "./users.controller.js";
import { User } from "../models/users.model.js";
import {
  ERROR_IN_DATABASE,
  INVALID_AUTHORISATION,
  NO_SUCH_RESOURCE,
} from "../utility/constants.js";
import { Types } from "mongoose";
import { comparePassword } from "../utility/hashPassword.js";

type UserDetailsWithoutPassword = Omit<UserDetails, "password">;

// POST /auth/signup
const signUp = async (
  req: Request<{}, UserDetailsWithoutPassword | ErrorResponse, UserDetails>,
  res: Response<UserDetailsWithoutPassword | ErrorResponse>
) => {
  createUser(req, res);
};

// POST /auth/login
type UserDetailsWithId = UserDetails & { id: Types.ObjectId };
type LoginDetails = {
  username: string;
  password: string;
};
const login = async (req: Request<{}, any, LoginDetails>, res: Response) => {
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

  const token = await jwt.sign(
    {
      name: user.name,
      age: user.age,
      username: user.username,
      email: user.email,
    },
    process.env.JSON_SECRET!,
    { expiresIn: 1 * 60 * 60 }
  );

  res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 });
  return res.status(200).json({
    name: user.name,
    age: user.age,
    username: user.username,
    email: user.email,
  });
};

const logout = async (req: Request, res: Response) => {};

export { signUp, login, logout };
