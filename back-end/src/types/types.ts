import { messageSchema, userSchema } from "./schemas.js";
import { z } from "zod";

type UserDetails = z.infer<typeof userSchema>;
type MessageContents = z.infer<typeof messageSchema>;

type ErrorResponse = {
  status: number;
  message: string;
};

export { UserDetails, ErrorResponse, MessageContents };
