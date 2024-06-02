// Module Imports

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

// Custom Imports

import useConnection from "./database/useConnection.js";
import userRouter from "./routes/users.routes.js";

const app: express.Express = express();

// Setting up the Express Server

dotenv.config();
app.use(morgan("combined"));
app.use(helmet());
app.use(express.json());

const PORT: number = process.env.PORT as any as number;

app.use("/users", userRouter);

app.listen(PORT, async () => {
  try {
    useConnection();
    console.log("Listening on port " + PORT);
  } catch (err) {
    console.log("Quitting...");
  }
});
