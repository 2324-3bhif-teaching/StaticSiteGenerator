import express, {Router} from "express";
import Keycloak from "keycloak-connect";
import { Unit } from "../database/unit";
import { memoryStore } from "../app";
import { ProjectService } from "../services/projectService";
import { StatusCodes } from "http-status-codes";
import * as fs from "fs/promises";
import {ConvertService} from "../services/convertService";
import {join} from "path";
import { ThemeService } from "../services/themeService";

export const projectRouter: Router = express.Router();
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

//get all projects of a user
projectRouter.get("/", [keycloak.protect()], async (req: any, res: any) : Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const projectService: ProjectService = new ProjectService(unit);
    try{
        res.status(StatusCodes.OK).send(await projectService.selectAllProjects(req.kauth.grant.access_token.content.preferred_username));
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    finally{
        await unit.complete();
    }
});

projectRouter.post("/", [keycloak.protect()], async (req: any, res: any) : Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const projectService: ProjectService = new ProjectService(unit);
    try{
        res.status(StatusCodes.CREATED).send(
            await projectService.insertProject(req.kauth.grant.access_token.content.preferred_username, req.body.name));
            await unit.complete(true);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});

//patch a project name; new name in the body
projectRouter.patch("/name/:id", [keycloak.protect()], async (req: any, res: any) : Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const projectService: ProjectService = new ProjectService(unit);
    try{
        res.status(StatusCodes.OK).send(
            await projectService.updateProject(
                req.kauth.grant.access_token.content.preferred_username, req.params.id, req.body.newName));
            await unit.complete(true);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});
//patch a project themeId; themeId in the body
projectRouter.patch("/theme/:id", [keycloak.protect()], async (req: any, res: any) : Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const projectService: ProjectService = new ProjectService(unit);
    try{
        res.status(StatusCodes.OK).send(
            await projectService.updateProjectTheme(
                req.kauth.grant.access_token.content.preferred_username, req.params.id, req.body.newThemeId));
            await unit.complete(true);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});

//delete a project with the id
projectRouter.delete("/:id", [keycloak.protect()], async (req: any, res: any) : Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const projectService: ProjectService = new ProjectService(unit);
    try{
        const projectPath: string | null = await projectService.getProjectPath(req.params.id);
        if (projectPath === null) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            await unit.complete(false);
            return;
        }
        const result: boolean = await projectService.deleteProject(
            req.kauth.grant.access_token.content.preferred_username, req.params.id);

        try {
            await fs.access(projectPath);
            await fs.rm(projectPath, {recursive: true});
        }
        catch (error) {
            console.log(error);
            console.log("No files to delete");
        }

        await unit.complete(true);
        res.status(StatusCodes.OK).send(result);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});

projectRouter.get("/convert/:id/:themeId", [keycloak.protect()], async (req: any, res: any) : Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const projectService: ProjectService = new ProjectService(unit);
    const themeService: ThemeService = new ThemeService(unit);
    const convertService: ConvertService = new ConvertService(unit);
    try{
        if (!await projectService.ownsProject(req.kauth.grant.access_token.content.preferred_username, req.params.id) ||
         !await themeService.isAllowedToUseTheme(req.kauth.grant.access_token.content.preferred_username, req.params.themeId)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        const projectPath: string | null = await projectService.getProjectPath(req.params.id);
        if (projectPath === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            return;
        }
        const destinationPath: string = `${projectPath}.zip`;
        console.log(req.query.generateTOC);
        await convertService.convertProject(
            req.params.id,
            req.params.themeId,
            destinationPath,
            req.query.generateTOC === 'true');
        const relativePath: string = join(__dirname, "/../..", destinationPath);
        res.status(StatusCodes.OK).sendFile(relativePath);
        await fs.rm(relativePath);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    finally {
        await unit.complete();
    }
});