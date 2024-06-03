import { conversationSchema, messageSchema, userSchema } from "./schemas.js";
import { z } from "zod";
import { Schema } from "mongoose";

type UserDetails = z.infer<typeof userSchema>;
type MessageContents = z.infer<typeof messageSchema>;
type Conversation = z.infer<typeof conversationSchema>;

type ErrorResponse = {
  status: number;
  message: string;
};

export { UserDetails, ErrorResponse, MessageContents, Conversation };
