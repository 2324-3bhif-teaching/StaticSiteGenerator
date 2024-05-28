import express from "express";
import cors from "cors";
import { projectRouter } from "./routers/projectsRouter";
import { themeRouter } from "./routers/themesRouter";
import { userRouter } from "./routers/usersRouter";
import { DB } from "./data";
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import "dotenv/config"
import { Project } from "./model";
import { convertFile } from "./converter";
import { Theme } from "./theme";
import { Style } from "./style";

const app = express();

if(process.env.SECRET_KEY === undefined){
    throw new Error("Secret was undefined")
}

const memoryStore = new session.MemoryStore();
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
const keycloak = new Keycloak({ store: memoryStore });

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRouter);
app.use("/api/themes", themeRouter);
app.use("/api/users", userRouter);

app.use(keycloak.middleware({
    logout: '/logout'
}));

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
    //await DB.createDBConnection();

    test();
    async function test(){
        const theme = new Theme("test","TestTheme",false);

        theme.addStyle("*",new Style("font-family", "Arial, sans-serif"));

        theme.addStyle("body", 
        new Style("background-color", "black"),
        new Style("color", "white"));

        theme.addStyle("p", 
            new Style("color", "white"));

        theme.addStyle("h1, h2, h3, h4, h5, h6", 
            new Style("color", "white"));

        theme.addStyle("a", 
            new Style("color", "white"));

        theme.addStyle("code", 
            new Style("color", "white"));

        theme.addStyle("pre", 
            new Style("background-color", "#333333"),
            new Style("color", "white"));

        const project : Project = {name: "test", theme:theme , files: [{index: 0, path: "./test/test.adoc"}]};

        const content = await convertFile(project,0);
        console.log(content);
    }
});