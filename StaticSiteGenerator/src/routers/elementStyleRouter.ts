import express, {Router} from "express";
import Keycloak from "keycloak-connect";
import { memoryStore } from "../app";
import { Unit } from "../database/unit";
import { ElementStyleData, ElementStyleService } from "../services/elementStyleService";
import { StatusCodes } from "http-status-codes";
import {ThemeService} from "../services/themeService";

export const elementStyleRouter: Router = express.Router();
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

//get all  element styles from a theme
elementStyleRouter.get("/themeId/:id", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const elementStyleService: ElementStyleService = new ElementStyleService(unit);
    const themeService: ThemeService = new ThemeService(unit);
    try{
        if (!await themeService.isAllowedToUseTheme(req.kauth.grant.access_token.content.preferred_username, req.params.id)){
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        res.status(StatusCodes.OK).send(await elementStyleService.selectAllElementStyles(req.params.id));
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    finally{
        await unit.complete();
    }
});

//post a new element style
elementStyleRouter.post("/", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const elementStyleService: ElementStyleService = new ElementStyleService(unit);
    const themeService: ThemeService = new ThemeService(unit);
    try{
        if (!await themeService.ownsTheme(req.kauth.grant.access_token.content.preferred_username, req.body.themeId)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            await unit.complete(false);
            return;
        }
        res.status(StatusCodes.CREATED).send(await elementStyleService.insertElementStyle(req.body as ElementStyleData));
        await unit.complete(true);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});

//patch an element styles selector
elementStyleRouter.patch("/:id", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const elementStyleService: ElementStyleService = new ElementStyleService(unit);
    try{
        if (!await elementStyleService.ownsElementStyle(req.kauth.grant.access_token.content.preferred_username, req.params.id)){
            res.sendStatus(StatusCodes.BAD_REQUEST);
            await unit.complete(false);
            return;
        }
        res.status(StatusCodes.OK).send(await elementStyleService.updateElementStyle(req.body.selector, req.params.id));
        await unit.complete(true);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});

//delete a element style
elementStyleRouter.delete("/:id", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const elementStyleService: ElementStyleService = new ElementStyleService(unit);
    try{
        if (!await elementStyleService.ownsElementStyle(req.kauth.grant.access_token.content.preferred_username, req.params.id)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            await unit.complete(false);
            return;
        }
        res.status(StatusCodes.OK).send(await elementStyleService.deleteElementStyle(req.params.id));
        await unit.complete(true);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});