import express, {Router} from "express";
import Keycloak from "keycloak-connect";
import {memoryStore} from "../app";
import multer, {Multer, StorageEngine} from "multer";
import {join} from "path";
import {v4 as uuidv4} from "uuid";
import {Unit} from "../database/unit";
import {FileService} from "../services/fileService";
import {StatusCodes} from "http-status-codes";
import {FileLocation} from "../constants";
import * as fs from "fs/promises";
import {ProjectService} from "../services/projectService";
import {File} from "../services/fileService";
import {ConvertService} from "../services/convertService";

export const filesRouter: Router = express.Router();
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

const storage: StorageEngine = multer.diskStorage({
    destination: (_: any, file: any, cb) => {
        cb(null, join(__dirname, "../../", FileLocation , "temp"));
    },
    filename: (_: any, file: any, cb) => {
        cb(null, `${uuidv4()}.${file.originalname}`);
    }
});

const upload: Multer = multer(
    {
        storage: storage
    });

filesRouter.get("/:projectId", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const fileService: FileService = new FileService(unit);
    const projectService: ProjectService = new ProjectService(unit);
    try {
        if (!await projectService.ownsProject(req.kauth.grant.access_token.content.preferred_username, req.params.projectId)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        const files: File[] = await fileService.selectFilesOfProject(req.params.projectId);
        if (files.length === 0) {
            res.sendStatus(StatusCodes.NOT_FOUND);
        }
        else {
            res.status(StatusCodes.OK).send(files);
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    finally {
        await unit.complete();
    }
});

filesRouter.post("/", [keycloak.protect(), upload.array("file")], async (req: any, res: any): Promise<void> => {
    if (req.files === undefined) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    const unit: Unit = await Unit.create(false);
    const fileService: FileService = new FileService(unit);
    const projectService: ProjectService = new ProjectService(unit);
    try {
        const projectPath: string | null = await projectService.getProjectPath(req.body.projectId);
        if (projectPath === null
            || !await projectService.ownsProject(req.kauth.grant.access_token.content.preferred_username, req.body.projectId)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            await unit.complete(false);
            return;
        }

        let result;
        for (const file of req.files) {
            result = await fileService.insertFile(req.body.projectId, file.originalname) || result;
        }

        await fs.mkdir(join(__dirname, "../../",  projectPath), {recursive: true});

        for (const file of req.files) {
            await fs.rename(file.path, join(__dirname, "../../", projectPath, file.originalname));
        }

        await unit.complete(true);
        res.status(StatusCodes.CREATED).send(result);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});

filesRouter.delete("/:fileId", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const fileService: FileService = new FileService(unit);
    try {
        if (!await fileService.ownsFile(req.kauth.grant.access_token.content.preferred_username, req.params.fileId)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            await unit.complete(false);
            return;
        }
        const filePath: string | null = await fileService.getFilePath(req.params.fileId);
        if (filePath === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
            await unit.complete(false);
            return;
        }

        const result: boolean = await fileService.deleteFile(req.params.fileId);
        await fs.rm(filePath);

        await unit.complete(true);
        res.status(StatusCodes.OK).send(result);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});

filesRouter.patch("/:fileId", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const fileService: FileService = new FileService(unit);
    try {
        if (!await fileService.ownsFile(req.kauth.grant.access_token.content.preferred_username, req.params.fileId)) {
            res.sendStatus(StatusCodes.BAD_REQUEST);
            await unit.complete(false);
            return;
        }

        const result: boolean = await fileService.updateFileIndex(req.params.fileId, req.body.index);

        await unit.complete(true);
        res.status(StatusCodes.OK).send(result);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});

filesRouter.get("/convert/:fileId/:projectId/:generateTOC", [keycloak.protect()], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(true);
    const fileService: FileService = new FileService(unit);
    const convertService: ConvertService = new ConvertService(unit);
    try {
        if (!await fileService.ownsFile(req.kauth.grant.access_token.content.preferred_username, req.params.fileId) ||
            !(await fileService.selectFilesOfProject(req.params.projectId)).some((file: File) => file.id === parseInt(req.params.fileId))){
            res.sendStatus(StatusCodes.BAD_REQUEST);
            return;
        }
        const filePath: string | null = await fileService.getFilePath(req.params.fileId);
        if (filePath === null) {
            res.sendStatus(StatusCodes.NOT_FOUND);
        }
        else {
            let html: string = "";
            if(req.params.generateTOC === "true"){
                html += await convertService.createTableOfContent(req.params.projectId)
            }
            html += await convertService.convertFile(req.params.fileId, true);

            res.status(StatusCodes.OK).send({
                html: html
            });
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    finally {
        await unit.complete();
    }
});