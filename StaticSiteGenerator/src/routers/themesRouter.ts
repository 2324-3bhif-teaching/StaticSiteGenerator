import express, {Router} from "express";
import { StatusCodes } from "http-status-codes";
import {Unit} from "../database/unit";
import {ThemeService } from "../services/themeService";
import { memoryStore } from "../app";
import Keycloak from "keycloak-connect";
import {ConvertService} from "../services/convertService";

export const themeRouter: Router = express.Router();
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

themeRouter.get('/', async (_: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const service: ThemeService = new ThemeService(unit);
    try {
        res.status(StatusCodes.OK).send(await service.selectPublicThemes());
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
        res.status(StatusCodes.OK).send(await service.selectThemesByUser(req.kauth.grant.access_token.content.preferred_username));
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
        res.status(StatusCodes.CREATED).send(await service.insertTheme({
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

themeRouter.get('/convert/:id', [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const themeService: ThemeService = new ThemeService(unit);
    const styleService: ConvertService = new ConvertService(unit);
    try {
        if (!await themeService.isAllowedToUseTheme(req.kauth.grant.access_token.content.preferred_username, req.params.id)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        res.status(StatusCodes.OK).send({
            css: await styleService.convertThemeToCss(req.params.id)
        });
    }
    catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    finally {
        await unit.complete();
    }
});