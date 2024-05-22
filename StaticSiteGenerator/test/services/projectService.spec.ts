import { Project } from "../../src/services/projectService";
import {setupTestData} from "../database/testData";

const testProjectData: Project[] = [
    {id: 1, name: "Static Site Generator Docs", userName: "SSG", themeId: 1},
    {id: 2, name: "Static Site Generator Docs", userName: "SSG", themeId: 1},
    {id: 3, name: "Static Site Generator Docs", userName: "SSG", themeId: 1},
    {id: 4, name: "Static Site Generator Docs", userName: "SSG", themeId: 1}
];

describe("ProjectService", () => {
    beforeAll(async () => {
        await setupTestData();
    });

    describe("selectAllProjects", () => {

    });

    describe("insertProject", () => {

    });

    describe("updateProject", () => {

    });

    describe("updateProjectTheme", () => {

    });

    describe("deleteProject", () => {

    });
});