// Module Imports

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Custom Imports

import useConnection from "./database/useConnection.js";
import userRouter from "./routes/users.routes.js";
import messageRouter from "./routes/messages.routes.js";
import conversationRouter from "./routes/conversations.routes.js";
import authRouter from "./routes/auth.routes.js";

const app: express.Express = express();

// Setting up the Express Server

dotenv.config();
app.use(morgan("combined"));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

const PORT: number = process.env.PORT as any as number;

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/messages", messageRouter);
app.use("/conversations", conversationRouter);

app.listen(PORT, async () => {
  try {
    useConnection();
    console.log("Listening on port " + PORT);
  } catch (err) {
    console.log("Quitting...");
  }
});
