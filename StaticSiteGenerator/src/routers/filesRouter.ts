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

export const filesRouter: Router = express.Router();
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

const storage: StorageEngine = multer.diskStorage({
    destination: (_, file, cb) => {
        cb(null, join(__dirname, "../../", FileLocation , "temp"));
    },
    filename: (_, file, cb) => {
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
            res.sendStatus(StatusCodes.FORBIDDEN);
            return;
        }
        res.status(StatusCodes.OK).send(await fileService.selectFilesOfProject(req.params.projectId));
    }
    catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
    }
    finally {
        await unit.complete();
    }
});

filesRouter.post("/", [keycloak.protect(), upload.single("file")], async (req: any, res: any): Promise<void> => {
    const unit: Unit = await Unit.create(false);
    const fileService: FileService = new FileService(unit);
    try {
        await fileService.insertFile(req.body.projectId, req.file.originalname);

        await fs.mkdir(join(__dirname, "../../", FileLocation, req.body.projectId.toString()), {recursive: true});
        await fs.rename(req.file.path, join(__dirname, "../../", FileLocation, req.body.projectId.toString(), req.file.originalname));

        await unit.complete(true);
        res.sendStatus(StatusCodes.CREATED);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(StatusCodes.BAD_REQUEST);
        await unit.complete(false);
    }
});