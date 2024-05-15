import express from "express";
import {Unit} from "../database/unit";
import {StatusCodes} from "http-status-codes";
import {Project} from "../model";
import {Theme} from "../theme";
import {DB} from "../database/data";

export const projectRouter = express.Router();

projectRouter.get('/', async (req, res) => {
    const prj = req.body;

    if (prj.token === undefined) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const unit: Unit = await Unit.create(true);
    try {
        const stmt = await unit.prepare(`SELECT *
                                         from project
                                         where userName = ?1`, {1: prj.token});
        const projects: Project[] = await stmt.all<Project[]>();

        res.status(StatusCodes.OK).send(projects);
    } catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    } finally {
        await unit.complete();
    }
});

projectRouter.post('/', async (req, res) => {
    const prj = req.body;

    if (prj.token === undefined || prj.projectName === undefined) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const unit: Unit = await Unit.create(false);
    try {
        const stmt = await unit.prepare(`Insert into Project (name, userName, themeName, themeOwner) VALUES (?1, ?2,?3,?4)`,
            {1:prj.projectName ,2:prj.token,3:Theme.DefaultName,4:DB.SystemUserName});

        await stmt.run();
        await unit.complete(true);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (error){
        console.log(error);
        await unit.complete(false);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }

});

projectRouter.put('/', async (req, res) => {
    // Body contatins user token and project Name
    throw new Error("Not Implemented");
});

projectRouter.delete('/', async (req, res) => {
    // Body contatins user token and project Name
    throw new Error("Not Implemented");
});