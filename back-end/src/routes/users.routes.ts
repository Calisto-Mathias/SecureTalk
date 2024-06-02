import { Router } from "express";

import {
  createUser,
  updateUser,
  getUser,
  getAllUsers,
  deleteUser,
} from "../controllers/users.controller.js";

const router: Router = Router();

// CRUD Operations

router.post("/create", createUser);
router.put("/:id", updateUser);
router.get("/:id", getUser);
router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

export default router;
