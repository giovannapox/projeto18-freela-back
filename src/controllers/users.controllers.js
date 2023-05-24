import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";

export async function signup(req, res){
    const { name, email, photo, biography, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    try {
        await db.query(`
        INSERT INTO users
        (name, email, photo, biography, password)
        VALUES ($1, $2, $3, $4, $5);`,
        [name, email, photo, biography, hash]);

        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};