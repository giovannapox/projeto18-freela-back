import express from "express";
import cors from "cors";
import usersRoute from "../src/routers/users.router.js";
import postsRoute from "../src/routers/posts.router.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(usersRoute);
app.use(postsRoute);

const port = 5000;
app.listen(port, () => {console.log(`Servidor rodando na porta ${port}`)});