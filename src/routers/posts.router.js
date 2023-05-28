import { Router } from "express";
import postValidation from "../middlewares/posts.validation.js";
import { getPosts, newPost } from "../controllers/posts.controllers.js";

const router = Router();

router.post("/newpost", postValidation, newPost);
router.get("/home", getPosts);

export default router;