import { db } from "../database/database.connection.js";

export async function getPosts(req, res) {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);

    const token = authorization?.replace("Bearer ", "");
    try {
        const tokenExists = await db.query(`SELECT * FROM sessions WHERE token=$1;`, [token]);
        if (!tokenExists.rows) return res.sendStatus(401);

        const userExists = await db.query(`
        SELECT posts.*
        FROM posts
        JOIN sessions ON posts."userId" = sessions."userId"
        WHERE sessions.token = $1
        GROUP BY posts.id;`, [token]);
        const user = userExists.rows

        return res.status(200).send(user);

    } catch (err) {
        return res.status(500).send(err.message);
    }
};


export async function newPost(req, res) {
    const { authorization } = req.headers;
    const { image, postDescription } = req.body;
    if (!authorization) return res.sendStatus(401);

    const token = authorization?.replace("Bearer ", "");
    try {
        const tokenExists = await db.query(`SELECT * FROM sessions WHERE token=$1;`, [token]);
        if (!tokenExists.rows) return res.sendStatus(401);

        await db.query(`INSERT INTO posts (image, "postDescription", "userId") VALUES ($1, $2, $3);`, [image, postDescription, tokenExists.rows[0].userId]);
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

