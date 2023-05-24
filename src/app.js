import express from "express";
import cors from "cors";
import usersRoute from "../src/routers/users.router.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(usersRoute);

const port = 5000;
app.listen(port, () => {console.log(`Servidor rodando na porta ${port}`)});