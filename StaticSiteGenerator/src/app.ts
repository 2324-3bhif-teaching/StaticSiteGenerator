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

if (process.env.SECRET_KEY === undefined) {
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
    async function test() {
        const lightTheme = new Theme("test", "TestTheme", false);

        lightTheme.addStyle("*", new Style("font-family", "Helvetica"), new Style("color", "#34495E"));
        lightTheme.addStyle("h1,h2,h3", new Style("margin-top", "4rem"))

        lightTheme.addStyle("body", new Style("background-color", "#FFFFFF"), new Style("padding-left", "6rem"))
        lightTheme.addStyle("a", new Style("color", "#42B983"), new Style("font-weight", "bold"));
        lightTheme.addStyle("pre", new Style("background-color", "#42B98355"),
            new Style("padding", "1rem"), new Style("border-radius", "0.3rem"), new Style("line-height", "120%"), new Style("border-left", "6px solid #42B983"));

        const darkTheme = new Theme("test", "DarkTheme", false);

        darkTheme.addStyle("*", new Style("font-family", "Helvetica"), new Style("color", "#AAA"));
        darkTheme.addStyle("h1,h2,h3", new Style("margin-top", "4rem"))

        darkTheme.addStyle("body", new Style("background-color", "#222"), new Style("padding-left", "6rem"))
        darkTheme.addStyle("a", new Style("color", "#42B983"), new Style("font-weight", "bold"));
        darkTheme.addStyle("pre", new Style("background-color", "#42B98355"),
            new Style("padding", "1rem"), new Style("border-radius", "0.3rem"), new Style("line-height", "120%"), new Style("border-left", "6px solid #42B983"));

        const project: Project = { name: "test", theme: lightTheme, files: [{ index: 0, path: "./test/test.adoc" }] };

        const content = await convertFile(project, 0);
        console.log(content);
    }
});