import express, {Router} from "express";
import { StatusCodes } from "http-status-codes";
import {Unit} from "../database/unit";
import {ThemeService } from "../services/themeService";
import { memoryStore } from "../app";
import Keycloak from "keycloak-connect";
import {ConvertService} from "../services/convertService";
import {ElementStyle, ElementStyleService} from "../services/elementStyleService";
import {StyleService, Style} from "../services/styleService";

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

themeRouter.put('/copy/:baseThemeId/:themeName', [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const themeService: ThemeService = new ThemeService(unit);
    const elementStyleService: ElementStyleService = new ElementStyleService(unit);
    const styleService: StyleService = new StyleService(unit);
    try {
        const themeId: number | undefined = (await themeService.selectThemesByUser(req.kauth.grant.access_token.content.preferred_username))
            .find(theme => theme.name === req.params.themeName)?.id;
        if (themeId === undefined
            || !await themeService.isAllowedToUseTheme(req.kauth.grant.access_token.content.preferred_username, req.params.baseThemeId)
            || !await themeService.ownsTheme(req.kauth.grant.access_token.content.preferred_username, themeId)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            await unit.complete(false);
            return;
        }
        let result;
        const elementStyles: ElementStyle[] = await elementStyleService.selectAllElementStyles(req.params.baseThemeId);
        for (const elementStyle of elementStyles) {
            result = await elementStyleService.insertElementStyle(
                {selector: elementStyle.selector, themeId: themeId})
                || result;
        }
        const newElementStyles: ElementStyle[] = (await elementStyleService.selectAllElementStyles(themeId));
        newElementStyles.splice(0, newElementStyles.length - elementStyles.length);
        for (let i = 0; i < elementStyles.length; i++) {
            const styles: Style[] = await styleService.selectAll(elementStyles[i].id);
            for (const style of styles) {
                result = await styleService.insertStyle({elementStyleId: newElementStyles[i].id, property: style.property, value: style.value})
                || result;
            }
        }
        res.status(StatusCodes.OK).send(result);
        await unit.complete(true);
    }
    catch (error) {
        console.log(error);
        await unit.complete(false);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});