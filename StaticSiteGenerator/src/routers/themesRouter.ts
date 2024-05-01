import express from "express";
import { DB } from "../data";
import { Theme } from "../theme";
import { StatusCodes } from "http-status-codes";

export const themeRouter = express.Router();

themeRouter.get('/', async (_, res) => {
    let db;
    try {
        db = await DB.createDBConnection();
        const themes: Theme[] = await db.all<Theme[]>("select * from theme where isPublic != 0");
        res.send(themes);
    }
    catch (error) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    } finally {
        if (db) {
            await db.close();
        }
    }
});

themeRouter.get('/:username', async (req, res) => {
    const user = req.params.username;
    let stmt;
    let db;
    try {
        db = await DB.createDBConnection();

        stmt = await db.prepare("select * from Theme where userName = ?1");
        await stmt.bind({ 1: user });
        const themes = await stmt.all<Theme[]>();

        if (themes.length === 0) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.send(themes);
    } catch (error) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    } finally {
        if (stmt) {
            await stmt.finalize();
        }
        if (db) {
            await db.close();
        }
    }
});

themeRouter.get('/:username/:name', async (req, res) => {
    const user = req.params.username;
    const themeName = req.params.name;
    let stmt;
    let db;
    try {
        db = await DB.createDBConnection();
        stmt = await db.prepare("select * from Theme where isPublic != 0 and userName = ?1 and name = ?2");
        await stmt.bind({ 1: user, 2: themeName });

        const themes = await stmt.get<Theme>();

        if (!themes) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }

        res.send(themes);
    } catch (error) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
    } finally {
        if (stmt) {
            await stmt.finalize();
        }
        if (db) {
            await db.close();
        }
    }
});

themeRouter.post('/', async (req, res) => {
    const theme: Theme = req.body;

    if (!theme.name || !theme.userName || theme.name.trim() === "" || theme.userName.trim() === "") {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    let stmt;
    let db;
    try {
        db = await DB.createDBConnection();
        await DB.beginTransaction(db);

        stmt = await db.prepare("INSERT INTO theme (isPublic, userName, name) VALUES (?1, ?2, ?3)");
        await stmt.bind({ 1: theme.isPublic, 2: theme.userName, 3: theme.name });

        await stmt.run();

        await DB.commitTransaction(db);
        res.sendStatus(StatusCodes.CREATED);
    } catch (error) {
        if (db) {
            await DB.rollbackTransaction(db);
        }
        res.sendStatus(StatusCodes.BAD_REQUEST);
    } finally {
        if (stmt) {
            await stmt.finalize();
        }
        if (db) {
            await db.close();
        }
    }
});


themeRouter.put('/:username/:name', async (req, res) => {
    const theme: Theme = req.body;
    const username: String = req.params.username;
    const name: String = req.params.name;

    if (!theme.name || theme.name.trim() === "") {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    let stmt;
    let db;
    try {
        db = await DB.createDBConnection();

        await DB.beginTransaction(db);

        stmt = await db.prepare("UPDATE Theme SET isPublic = ?1, name = ?2 WHERE userName = ?3 AND name = ?4");

        await stmt.bind({ 1: theme.isPublic, 2: theme.name, 3: username, 4: name });
        await stmt.run();
        await DB.commitTransaction(db);
        res.sendStatus(StatusCodes.OK);

    } catch (error) {
        if (db) {
            await DB.rollbackTransaction(db);
        }
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    } finally {
        if (stmt) {
            await stmt.finalize();
        }
        if (db) {
            await db.close();
        }
    }
});


themeRouter.delete('/:username/:name', async (req, res) => {
    const theme: String = req.params.name;
    const username: String = req.params.username;

    let db;
    try {
        db = await DB.createDBConnection();
        await DB.beginTransaction(db);

        const stmt = await db.prepare("DELETE FROM Theme WHERE userName = ?1 AND name = ?2");
        await stmt.bind({ 1: username, 2: theme });

        await stmt.run();
        await stmt.finalize();

        await DB.commitTransaction(db);
        res.sendStatus(StatusCodes.OK);
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
});