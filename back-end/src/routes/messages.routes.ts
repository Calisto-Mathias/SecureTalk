import { Router } from "express";

import {
  createMessage,
  getMessage,
  sendMessage,
} from "../controllers/messages.controller.js";
import {
  verifyToken,
  userVerificationValidation,
} from "../middlewares/useVerify.js";

const router: Router = Router();

// CRUD ROUTES
router.post("/create", createMessage);
router.get("/:id", getMessage);

// OTHER ROUTES
router.post("/send", verifyToken, userVerificationValidation, sendMessage); // :id referes to ID of type mongoose.Schema.Types.ObjectId, ref: User

export default router;
