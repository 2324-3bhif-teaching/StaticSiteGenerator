import express from "express";
import { StatusCodes } from "http-status-codes";
import {Unit} from "../database/unit";
import {ThemeService } from "../services/themeService";
import { memoryStore } from "../app";
import Keycloak from "keycloak-connect";

export const themeRouter = express.Router();
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

themeRouter.get('/', async (_, res): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const service: ThemeService = new ThemeService(unit);
    try {
        res.status(StatusCodes.OK).send(await service.getPublicThemes());
    }
    catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    finally {
        await unit.complete();
    }
});

themeRouter.get('/private', [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const service: ThemeService = new ThemeService(unit);
    try {
        res.status(StatusCodes.OK).send(await service.getThemesByUser(req.kauth.grant.access_token.content.preferred_username));
    }
    catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    finally {
        await unit.complete();
    }
});

themeRouter.post('/', [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const service: ThemeService = new ThemeService(unit);
    try {
        res.status(StatusCodes.CREATED).send(await service.createTheme({
            userName: req.kauth.grant.access_token.content.preferred_username,
            name: req.body.name.trim(),
            isPublic: req.body.isPublic
        }));
        await unit.complete(true);
    }
    catch (error) {
        console.log(error);
        await unit.complete(false);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

themeRouter.patch('/name/:id', [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const service: ThemeService = new ThemeService(unit);
    try {
        res.status(StatusCodes.OK).send(await service.updateThemeName(
            req.kauth.grant.access_token.content.preferred_username,
            req.params.id,
            req.body.name));
        await unit.complete(true);
    }
    catch (error) {
        console.log(error);
        await unit.complete(false);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

themeRouter.patch('/isPublic/:id', [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const service: ThemeService = new ThemeService(unit);
    try {
        res.status(StatusCodes.OK).send(await service.updateThemePublic(
            req.kauth.grant.access_token.content.preferred_username,
            req.params.id,
            req.body.isPublic));
        await unit.complete(true);
    } catch (error) {
        console.log(error);
        await unit.complete(false);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

themeRouter.delete('/:id', [keycloak.protect()],async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const service: ThemeService = new ThemeService(unit);
    try {
        res.status(StatusCodes.OK).send(await service.deleteTheme(
            req.kauth.grant.access_token.content.preferred_username,
            req.params.id));
        await unit.complete(true);
    }
    catch (error) {
        console.log(error);
        await unit.complete(false);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});