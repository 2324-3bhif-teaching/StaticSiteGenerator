import express from "express";
import Keycloak from "keycloak-connect";
import { memoryStore } from "../app";
import { Unit } from "../database/unit";
import { StatusCodes } from "http-status-codes";
import { StyleData, StyleService } from "../services/styleService";

export const styleRouter = express.Router();
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

//get all styles for a style element
styleRouter.get("/elementStyle/:id", async (req, res) => {
    const unit: Unit = await Unit.create(true);
    const service: StyleService = new StyleService(unit);
    try{
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
styleRouter.post("/", async (req, res) => {
    const unit: Unit = await Unit.create(true);
    const service: StyleService = new StyleService(unit);
    try{
        await service.insertStyle(req.body as StyleData);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

//patch the property of a style
styleRouter.patch("/:id/property", async (req, res) => {
    const unit: Unit = await Unit.create(true);
    const service: StyleService = new StyleService(unit);
    try{
        await service.updateStyleProperty(Number.parseInt(req.params.id), req.body.newProperty)
        res.sendStatus(StatusCodes.CREATED);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

//patch the value of a style
styleRouter.post("/:id/value", async (req, res) => {
    const unit: Unit = await Unit.create(true);
    const service: StyleService = new StyleService(unit);
    try{
        await service.updateStyleValue(Number.parseInt(req.params.id), req.body.newValue);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});

//delete a style
styleRouter.post("/:id", async (req, res) => {
    const unit: Unit = await Unit.create(true);
    const service: StyleService = new StyleService(unit);
    try{
        await service.deleteStyle(Number.parseInt(req.params.id));
        res.sendStatus(StatusCodes.CREATED);
    }
    catch(error){
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
});