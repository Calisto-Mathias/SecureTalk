import { Router } from "express";

import { createUser } from "../controllers/users.controller.js";

const router: Router = Router();

// CRUD Operations

router.get("/create", createUser);

export default router;
