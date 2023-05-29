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

export async function getUsers (req, res) {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);

    const token = authorization?.replace("Bearer ", "");
    try {
        const userId = await db.query(`SELECT "userId" FROM sessions WHERE token = $1;`, [token]);
        const id = userId.rows[0].userId
        console.log(id);

        const users = await db.query(`SELECT * FROM users WHERE id != $1;`, [id]);
        
        return res.status(200).send(users.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

export async function getUser(req, res) {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);

    const token = authorization?.replace("Bearer ", "");
    try {
        const tokenExists = await db.query(`SELECT * FROM sessions WHERE token=$1;`, [token]);
        if (!tokenExists.rows) return res.sendStatus(401);

        const userExists = await db.query(`
        SELECT users.*
        FROM users
        JOIN sessions ON users.id = sessions."userId"
        WHERE sessions.token = $1
        GROUP BY users.id;`, [token]);
        const user = userExists.rows[0];

        return res.status(200).send(user);

    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export async function postFollowing (req, res){
    const { id } = req.params;
    const { followingId } = req.body;
    try {
        const following = await db.query(`SELECT * FROM following WHERE "userId" = $1 AND "followingId" = $2;`, [id, followingId]);
        if(!following.rows[0]) {
        await db.query(`INSERT INTO following ("userId", "followingId") VALUES ($1, $2);`, [id, followingId]);
        return res.sendStatus(201);
        } else {
            return res.sendStatus(404);
        }
        
    } catch (err) {
        return res.status(500).send(err.message);
    }
    
};

export async function getFollowing (req, res) {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);

    const token = authorization?.replace("Bearer ", "");
    try {
        const userId = await db.query(`SELECT "userId" FROM sessions WHERE token = $1;`, [token]);
        const id = userId.rows[0].userId
        const following = await db.query(`SELECT following.*, users.* FROM following JOIN users ON following."followingId" = users.id WHERE "userId" = $1;`, [id]);
        return res.status(200).send(following.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    };
}

export async function getFollowers (req, res) {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);

    const token = authorization?.replace("Bearer ", "");
    try {
        const userId = await db.query(`SELECT "userId" FROM sessions WHERE token = $1;`, [token]);
        const id = userId.rows[0].userId;
        const followers = await db.query(`SELECT following.*, users.* FROM following JOIN users ON following."userId" = users.id WHERE "followingId" = $1;`, [id]);
        return res.status(200).send(followers.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

export async function getProfileById (req, res){
    const { id } = req.params;
    try {
        const profile = await db.query(`SELECT * FROM users WHERE users.id = $1;`, [id]);

        return res.status(200).send(profile.rows[0]);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export async function getPostsById (req, res){
    const { id } = req.params;
    try {
        const profile = await db.query(`SELECT * FROM posts WHERE posts."userId" = $1;`, [id]);

        return res.status(200).send(profile.rows);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};