import { Router } from "express";

import {
  createMessage,
  getMessage,
} from "../controllers/messages.controller.js";

const router: Router = Router();

router.post("/create", createMessage);
router.get("/:id", getMessage);

export default router;
