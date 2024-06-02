import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
});

export { userSchema };
