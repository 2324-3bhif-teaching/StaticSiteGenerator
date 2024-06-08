import express from "express";
import cors from "cors";
import { projectRouter } from "./routers/projectsRouter";
import { themeRouter } from "./routers/themesRouter";
import { DB } from "./database/data";
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import "dotenv/config";
import * as fs from "fs/promises";

import { elementStyleRouter } from "./routers/elementStyleRouter";
import { styleRouter } from "./routers/styleRouter";
import {filesRouter} from "./routers/filesRouter";
import {TempFileLocation} from "./constants";
import {join} from "path";

const app = express();

(async () => {
    const connection = await DB.createDBConnection();
    await DB.ensureTablesPopulated(connection);
    await fs.mkdir(join(__dirname, "../", TempFileLocation), {recursive: true});
    await connection.close();
})();

if(process.env.SECRET_KEY === undefined){
    throw new Error("Secret was undefined")
}

export const memoryStore = new session.MemoryStore();
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
const keycloak: Keycloak.Keycloak = new Keycloak({ store: memoryStore });

app.use(cors());
app.use(express.json());

app.use(keycloak.middleware({
    logout: '/logout'
}));

app.use("/api/projects", projectRouter);
app.use("/api/themes", themeRouter);
app.use("/api/elementStyles", elementStyleRouter);
app.use("/api/styles", styleRouter);
app.use("/api/files", filesRouter);

// Protected route
app.get('/protected', [keycloak.protect()], (req: any, res: any) => {
    const token = req.kauth.grant.access_token.content;
    console.log(token.name); // Use the token as required
    res.send('Secret stuff');
});

// Logout route
app.get('/logout', keycloak.protect(), (req: any, res) => {
    req.kauth.logout();
    res.redirect('/');
});



app.listen(3000, async () => {
    console.log("Server listening on port 3000");
});