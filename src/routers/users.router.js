import { Router } from "express";
import { signinValidation, signupValidation } from "../middlewares/users.validation.js";
import { signin, signup } from "../controllers/users.controllers.js";
import { getUser } from "../controllers/posts.controllers.js";

const router = Router();

router.post("/signup", signupValidation, signup);
router.post("/signin", signinValidation, signin);
router.get("/user", getUser)

export default router;