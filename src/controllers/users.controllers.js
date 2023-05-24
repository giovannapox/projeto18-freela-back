import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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

export async function signin (req, res){
    const { email } = req.body;

    try {
        const token = uuid();

        const userExists = await db.query(`SELECT * FROM users WHERE email=$1;`, [email]);
        const id = userExists.rows[0].id;

        const tokenExists = await db.query(
            `SELECT token FROM sessions 
            JOIN users ON sessions."userId" = users.id
            WHERE users.id=$1;`, [id]);

        if (tokenExists.rows.length !== 0) {
            return res.status(200).send(tokenExists.rows[0]);
        } else {
            await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2);`, [token, id]);
        };
        return res.status(200).send({ token: token })
    } catch (err) {
        return res.status(500).send(err.message);
    };
};