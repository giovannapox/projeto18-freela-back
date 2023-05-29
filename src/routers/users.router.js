import { Router } from "express";
import { signinValidation, signupValidation } from "../middlewares/users.validation.js";
import { getFollowing, getUser, getUsers, postFollowing, signin, signup } from "../controllers/users.controllers.js";

const router = Router();

router.post("/signup", signupValidation, signup);
router.post("/signin", signinValidation, signin);
router.get("/user", getUser);
router.get("/users", getUsers);
router.post("/following/:id", postFollowing);
router.get("/following", getFollowing);

export default router;