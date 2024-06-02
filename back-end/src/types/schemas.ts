import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
});

const messageSchema = z.object({
  text: z.string(),
  time: z.string().time(),
  owner: z.string(),
  conversation: z.string(),
});

export { userSchema, messageSchema };
