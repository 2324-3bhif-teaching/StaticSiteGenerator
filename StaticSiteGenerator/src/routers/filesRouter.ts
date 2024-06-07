import express from "express";
import Keycloak from "keycloak-connect";
import {memoryStore} from "../app";
import multer from "multer";
import {join} from "path";
import {v4 as uuidv4} from "uuid";

export const filesRouter = express.Router();
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

const storage = multer.diskStorage({
    destination: (_, file, cb) => {

        cb(null, join(__dirname, "..", "..", "data", "temp", uuidv4()));
    }
});

const upload = multer(
    {
        storage: storage
    });

filesRouter.post("/", [keycloak.protect(), upload.single("file")], async (req: any, res: any): Promise<void> => {
    //req.kauth.grant.access_token.content.preferred_username;
});