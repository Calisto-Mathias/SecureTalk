import { Request, Response } from "express";

import { User } from "../models/users.model.js";
import hashPassword from "../utility/hashPassword.js";
import { ErrorResponse, UserDetails } from "../types/types.js";
import { userSchema } from "../types/schemas.js";

type UserDetailsWithoutPassword = Omit<UserDetails, "password">;

const createUser = async (
  req: Request<{}, UserDetailsWithoutPassword | ErrorResponse, UserDetails>,
  res: Response<UserDetailsWithoutPassword | ErrorResponse>
) => {
  let details: UserDetails;
  try {
    details = userSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid Details Sent",
    });
  }

  details.password = hashPassword(details.password);

  try {
    const newUser = new User(details);
    await newUser.save();

    return res.status(201).json({
      name: details.name,
      age: details.age,
      username: details.username,
      email: details.email,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error in persisting to Database",
    });
  }
};

export { createUser };
