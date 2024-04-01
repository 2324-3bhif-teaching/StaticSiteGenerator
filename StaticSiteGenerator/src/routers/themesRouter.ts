import express from "express";
import { DB } from "../data";
import { Theme } from "../model";
import { StatusCodes } from "http-status-codes";

export const themeRouter = express.Router();

themeRouter.get('/', async (_, res) => {
    const db = await DB.createDBConnection();
    const themes: Theme[] = await db.all<Theme[]>("select * from theme where isPublic != 0");
    await db.close();

    res.send(themes);
});

themeRouter.get('/:username', async (_, res) => {
    throw new Error("Not Implemented");
});

themeRouter.get('/:username/:name', async (_, res) => {
    throw new Error("Not Implemented");
});

themeRouter.post('/', async (req, res) => {
    const theme: Theme = req.body;

    if (theme.name.trim() === "" || theme.userName.trim() === "") {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    let db;
    try {
        db = await DB.createDBConnection();

        await DB.beginTransaction(db);

        const stmt = await db.prepare("INSERT INTO theme (isPublic, userName, name) VALUES (?1, ?2, ?3)");

        await stmt.bind({ 1: theme.isPublic, 2: theme.userName, 3: theme.name });

        await stmt.run();

        await stmt.finalize();

        await DB.commitTransaction(db);
    } catch (error) {
        if (db) {
            await DB.rollbackTransaction(db);
        }
        res.sendStatus(StatusCodes.BAD_REQUEST);
    } finally {
        if (db) {
            await db.close();
        }
    }

    res.sendStatus(StatusCodes.CREATED);
});


themeRouter.put('/:username/:name', async (_, res) => {
    throw new Error("Not Implemented");
});


themeRouter.delete('/:username/:name', async (_, res) => {
    throw new Error("Not Implemented");
});

