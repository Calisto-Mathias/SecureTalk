import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorResponse, UserDetailsWithoutPassword } from "../types/types.js";

import {
  INVALID_AUTHORISATION,
  NOT_VERIFIED_USER,
} from "../utility/constants.js";
import { INVALID } from "zod";

const verifyToken = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: INVALID_AUTHORISATION,
    });
  }

  try {
    const user = jwt.verify(token, process.env.JSON_SECRET!);
    req.body.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: 401,
      message: INVALID_AUTHORISATION,
    });
  }
};

const userVerificationValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.user.verification) {
    return res.status(401).json({
      status: 401,
      message: NOT_VERIFIED_USER,
    });
  }

  console.log("here");
  next();
};

export { verifyToken, userVerificationValidation };
