import { Router } from "express";

import {
  createConversation,
  getConversation,
} from "../controllers/conversation.controller.js";

const router: Router = Router();

router.post("/create", createConversation);
router.get("/:id", getConversation);

export default router;
