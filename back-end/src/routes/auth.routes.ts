import { Router } from "express";

import { signUp, login, verifyOtp } from "../controllers/auth.controller.js";

const router: Router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);

export default router;
