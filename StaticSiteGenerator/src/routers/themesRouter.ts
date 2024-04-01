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

themeRouter.get('/:username', async (req, res) => {
    const user = req.params.username;
    let db;
    let themes;
    try {
        db = await DB.createDBConnection();
        const stmt = await db.prepare("select * from Theme where isPublic != 0 and userName = ?1");

        await stmt.bind({ 1: user });

        themes = await stmt.all<Theme[]>();

        await stmt.finalize();
    } catch (error) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    } finally {
        if (db) {
            await db.close();
        }
    }

    res.send(themes);
});

themeRouter.get('/:username/:name', async (req, res) => {
    const user = req.params.username;
    const themeName = req.params.name;
    let db;
    let themes : Theme|undefined;
    try {
        db = await DB.createDBConnection();
        const stmt = await db.prepare("select * from Theme where isPublic != 0 and userName = ?1 and name = ?2");

        await stmt.bind({ 1: user ,2:themeName});

        themes = await stmt.get<Theme>();

        await stmt.finalize();
    } catch (error) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    } finally {
        if (db) {
            await db.close();
        }
    }

    res.send(themes);
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


themeRouter.put('/:username/:name', async (req, res) => {
    throw new Error("Not Implemented");
});


themeRouter.delete('/:username/:name', async (req, res) => {
    const theme: String  = req.params.name;
    const username: String = req.params.username;

    let db;
    try {
        db = await DB.createDBConnection();

        await DB.beginTransaction(db);

        const stmt = await db.prepare("DELETE FROM Theme WHERE userName = ?1 AND name = ?2");

        await stmt.bind({ 1: username, 2: theme});

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

