import express, {Router} from "express";
import Keycloak from "keycloak-connect";
import { memoryStore } from "../app";
import { Unit } from "../database/unit";
import { StatusCodes } from "http-status-codes";
import { StyleData, StyleService } from "../services/styleService";
import {ElementStyleService} from "../services/elementStyleService";

export const styleRouter: Router = express.Router();
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

//get all styles for a style element
styleRouter.get("/elementStyle/:id", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const service: StyleService = new StyleService(unit);
    const elementStyleService: ElementStyleService = new ElementStyleService(unit);
    try{
        if (!await elementStyleService.isAllowedToUseElementStyle(req.kauth.grant.access_token.content.preferred_username, req.params.id)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        res.status(StatusCodes.OK).send(await service.selectAll(Number.parseInt(req.params.id)));
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    finally{
        await unit.complete();
    }
});

//post a style for a style element
styleRouter.post("/", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const service: StyleService = new StyleService(unit);
    const elementStyleService: ElementStyleService = new ElementStyleService(unit);
    try{
        if (!await elementStyleService.ownsElementStyle(req.kauth.grant.access_token.content.preferred_username, req.body.elementStyleId)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        res.status(StatusCodes.CREATED).send(await service.insertStyle(req.body as StyleData));
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

//patch the property of a style
styleRouter.patch("/:id/property", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const service: StyleService = new StyleService(unit);
    try{
        if (!await service.ownsStyle(req.kauth.grant.access_token.content.preferred_username, req.params.id)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        res.status(StatusCodes.CREATED).send(await service.updateStyleProperty(Number.parseInt(req.params.id), req.body.newProperty));
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

//patch the value of a style
styleRouter.patch("/:id/value", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const service: StyleService = new StyleService(unit);
    try{
        if (!await service.ownsStyle(req.kauth.grant.access_token.content.preferred_username, req.params.id)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        res.status(StatusCodes.CREATED).send(await service.updateStyleValue(Number.parseInt(req.params.id), req.body.newValue));
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

//delete a style
styleRouter.delete("/:id", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const service: StyleService = new StyleService(unit);
    try{
        if (!await service.ownsStyle(req.kauth.grant.access_token.content.preferred_username, Number.parseInt(req.params.id))) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        res.status(StatusCodes.CREATED).send(await service.deleteStyle(Number.parseInt(req.params.id)));
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});