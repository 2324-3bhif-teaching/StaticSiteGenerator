import express, {Router} from "express";
import Keycloak from "keycloak-connect";
import { Unit } from "../database/unit";
import { memoryStore } from "../app";
import { ProjectService } from "../services/projectService";
import { StatusCodes } from "http-status-codes";

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
        res.status(StatusCodes.OK).send(
            await projectService.deleteProject(
                req.kauth.grant.access_token.content.preferred_username, req.params.id));
            await unit.complete(true);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});
