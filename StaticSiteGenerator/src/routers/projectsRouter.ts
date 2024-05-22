import express from "express";
import Keycloak from "keycloak-connect";
import { memoryStore } from "../app";

export const projectRouter = express.Router();
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

//get all projects of a user
projectRouter.get("/", [keycloak.protect()], (req: any, res: any) : Promise<void> => {
    throw new Error("Not impemented");
});

projectRouter.post("/", [keycloak.protect()], (req: any, res: any) : Promise<void> => {
    throw new Error("Not impemented");
});

//patch a project name; new name in the body
projectRouter.patch("/:id", [keycloak.protect()], (req: any, res: any) : Promise<void> => {
    throw new Error("Not impemented");
});

//delete a project with the id
projectRouter.delete("/:id", [keycloak.protect()], (req: any, res: any) : Promise<void> => {
    throw new Error("Not impemented");
});
