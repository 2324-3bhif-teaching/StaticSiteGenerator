import express from "express";
import {Unit} from "../unit";
import {StatusCodes} from "http-status-codes";
import {Project} from "../model";
import {Theme} from "../theme";
import {DB} from "../data";

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

projectRouter.put('/:owner/:project', async (req, res) => {
    const prj = req.body;
    const prjName = req.params.project;
    const prjOwner = req.params.owner;
    if (prj.themeName === undefined ||
        prj.themeOwner === undefined ||
        prj.name === undefined) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const unit: Unit = await Unit.create(false);
    try {
        const stmt = await unit.prepare(`UPDATE Project Set themeName = ?1,themeOwner = ?2,name = ?3 
               where name = ?4 and userName = ?5`,
            {1: prj.themeName,2: prj.themeOwner,3:prj.name,4:prjName,5:prjOwner});

        await stmt.run();
        await unit.complete(true);
        res.sendStatus(StatusCodes.OK);
    }
    catch (error){
        console.log(error);
        await unit.complete(false);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

projectRouter.delete('/:owner/:name', async (req, res) => {

    const prjName = req.params.name;
    const prjOwner = req.params.owner;

    const unit: Unit = await Unit.create(false);
    try {
        const stmt = await unit.prepare(`Delete from Project where name = ?1 and userName = ?2`,
            {1:prjName,2:prjOwner});

        await stmt.run();
        await unit.complete(true);
        res.sendStatus(StatusCodes.OK);
    }
    catch (error){
        console.log(error);
        await unit.complete(false);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});