import { conversationSchema, messageSchema, userSchema } from "./schemas.js";
import { z } from "zod";
import { Schema } from "mongoose";

type UserDetails = z.infer<typeof userSchema>;
type MessageContents = z.infer<typeof messageSchema>;
type Conversation = z.infer<typeof conversationSchema>;

type UserDetailsWithoutPassword = Omit<UserDetails, "password">;
type UserDetailsWithId = Omit<UserDetails, "password"> & { id: string };

type ErrorResponse = {
  status: number;
  message: string;
};
type SuccessResponse = ErrorResponse;

export {
  UserDetails,
  ErrorResponse,
  SuccessResponse,
  MessageContents,
  Conversation,
  UserDetailsWithoutPassword,
  UserDetailsWithId,
};
