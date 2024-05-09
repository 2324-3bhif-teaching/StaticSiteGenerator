import express from "express";
import cors from "cors";
import { projectRouter } from "./routers/projectsRouter";
import { themeRouter } from "./routers/themesRouter";
import { userRouter } from "./routers/usersRouter";
import { DB } from "./data";
import session from 'express-session';
import Keycloak from 'keycloak-connect';
import "dotenv/config"

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
    await DB.createDBConnection();
});