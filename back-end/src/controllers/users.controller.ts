import { Request, Response } from "express";
import { Types } from "mongoose";

import { User } from "../models/users.model.js";
import hashPassword from "../utility/hashPassword.js";
import { ErrorResponse, UserDetails } from "../types/types.js";
import { userSchema } from "../types/schemas.js";

import {
  INVALID_REQUEST_BODY,
  ERROR_IN_DATABASE,
  NO_SUCH_RESOURCE,
} from "../utility/constants.js";

type UserDetailsWithoutPassword = Omit<UserDetails, "password">;

// POST /users/create
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
      message: INVALID_REQUEST_BODY,
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
      message: ERROR_IN_DATABASE,
    });
  }
};

// PUT /users/update/{_id}
type UpdateUserRequestBody = {
  id: string;
};
const updateUser = async (
  req: Request<
    UpdateUserRequestBody,
    UserDetailsWithoutPassword | ErrorResponse,
    UserDetails
  >,
  res: Response<UserDetailsWithoutPassword | ErrorResponse>
) => {
  const id: string = req.params.id;

  let details: UserDetails;
  try {
    details = userSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      message: "Invalid Request Body",
    });
  }

  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "User Does Not Exist!",
    });
  }

  user.name = details.name;
  user.age = details.age;
  user.username = details.username;
  user.password = hashPassword(details.password);
  user.email = details.email;

  console.log("here");
  try {
    await user.save();
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  return res.status(200).json();
};

// GET /users/:id
const getUser = async (
  req: Request<any, {}, UserDetailsWithoutPassword>,
  res: Response<UserDetailsWithoutPassword | ErrorResponse>
) => {
  const id: string = req.params.id;

  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: INVALID_REQUEST_BODY,
    });
  }

  return res.status(200).json({
    name: user.name,
    age: user.age,
    username: user.username,
    email: user.email,
  });
};

// GET /users/
type UserWithId = UserDetailsWithoutPassword & { id: Types.ObjectId };
type Users = {
  users: Array<UserWithId>;
};
const getAllUsers = async (req: Request, res: Response) => {
  let usersFetched;
  try {
    usersFetched = await User.find({});
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  const responseContent: Users = {
    users: [],
  };

  usersFetched.map((item) => {
    responseContent.users.push({
      name: item.name,
      age: item.age,
      username: item.username,
      email: item.email,
      id: item._id,
    });
  });

  return res.status(200).json(responseContent);
};

// DELETE /users/:id
type DeleteUserResponse = {
  message: string;
};
const deleteUser = async (
  req: Request<{ id: string }, any, DeleteUserResponse | ErrorResponse>,
  res: Response<DeleteUserResponse | ErrorResponse>
) => {
  const id: string = req.params.id;

  let user;
  try {
    user = await User.findById(id);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  if (!user) {
    return res.status(400).json({
      status: 400,
      message: NO_SUCH_RESOURCE,
    });
  }

  try {
    await User.deleteOne({ _id: user.id });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: ERROR_IN_DATABASE,
    });
  }

  return res.status(204).json({
    message: "Successfully Deleted!",
  });
};

export { createUser, updateUser, getUser, getAllUsers, deleteUser };
