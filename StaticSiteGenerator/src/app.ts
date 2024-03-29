import express from "express";
import cors from "cors";
import { projectRouter } from "./routers/projectsRouter";
import { themeRouter } from "./routers/themesRouter";
import { userRouter } from "./routers/usersRouter";
import { DB } from "./data";

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRouter);
app.use("/api/themes", themeRouter);
app.use("/api/users", userRouter);

app.listen(3000, async () => {
    console.log("Server listening on port 3000");
    await DB.createDBConnection();
});