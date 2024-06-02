import { userSchema } from "./schemas.js";
import { z } from "zod";

type UserDetails = z.infer<typeof userSchema>;

type ErrorResponse = {
  status: number;
  message: string;
};

export { UserDetails, ErrorResponse };
