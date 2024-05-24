import { DefaultTheme } from "../../src/constants";
import { Unit } from "../../src/database/unit";
import { Project, ProjectService } from "../../src/services/projectService";
import { ThemeData, ThemeService } from "../../src/services/themeService";
import {setupTestData} from "../database/testData";

const testProjectData: Project[] = [
    {id: 1, name: "Static Site Generator", userName: "SSG", themeId: 1},
    {id: 2, name: "AI Sign Language", userName: "SSG", themeId: 1},
    {id: 3, name: "Inventar", userName: "SSG", themeId: 1},
    {id: 4, name: "Dashboard", userName: "SSG", themeId: 1}
];

const testThemeData: ThemeData = {userName: "user1", name: "theme1", isPublic: true};

describe("ProjectService", () => {
    beforeAll(async () => {
        await setupTestData();
    });

    describe("insertProject", () => {
        for(const testProject of testProjectData){
            test("should create project", async () => {
                const unit: Unit = await Unit.create(false);
                const projectService: ProjectService = new ProjectService(unit);
                const res: boolean = await projectService.insertProject(testProject.userName, testProject.name);
                await unit.complete(true);
                expect(res).toBeTruthy();
            });
        }

        test("should not create duplicate project", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            await expect( async () => {
                const projectService: ProjectService = new ProjectService(unit);
                await projectService.insertProject(testProject.userName, testProject.name);
            }).rejects.toThrow(new Error('SQLITE_CONSTRAINT: UNIQUE constraint failed: Project.name, Project.user_name'));
            await unit.complete(false);
        });

        test("should not create with empty project name", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            await expect( async () => {
                const projectService: ProjectService = new ProjectService(unit);
                await projectService.insertProject(testProject.userName, "");
            }).rejects.toThrow(new Error('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_Name'));
            await expect( async () => {
                const projectService: ProjectService = new ProjectService(unit);
                await projectService.insertProject(testProject.userName, "   ");
            }).rejects.toThrow(new Error('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_Name'));
            await unit.complete(false);
        });

        test("should not create with empty user name", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            await expect( async () => {
                const projectService: ProjectService = new ProjectService(unit);
                await projectService.insertProject("", testProject.name);
            }).rejects.toThrow(new Error('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_User_Name'));
            await expect( async () => {
                const projectService: ProjectService = new ProjectService(unit);
                await projectService.insertProject("   ", testProject.name);
            }).rejects.toThrow(new Error('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_User_Name'));
            await unit.complete(false);
        });

        test("should create with default theme", async () => {
            const unit: Unit = await Unit.create(true);
            const projectService: ProjectService = new ProjectService(unit);
            const projects: Project[] = await projectService.selectAllProjects(testProjectData[0].userName);
            for(const project of projects){
                expect(project.themeId).toBe(DefaultTheme.id);
            }
            await unit.complete();
        });
    });

    describe("selectAllProjects", async () => {
        const unit: Unit = await Unit.create(true);
        const projectService: ProjectService = new ProjectService(unit);
        const selectedProjects: Project[] = await projectService.selectAllProjects(testProjectData[0].userName);
        expect(selectedProjects.length).toBe(testProjectData.length);
        for(let i: number = 0; i < selectedProjects.length; i++){
            expect(selectedProjects[i].id).toBe(testProjectData[i].id);
            expect(selectedProjects[i].name).toBe(testProjectData[i].name);
            expect(selectedProjects[i].themeId).toBe(testProjectData[i].themeId);
            expect(selectedProjects[i].userName).toBe(testProjectData[i].userName);
        }
        await unit.complete();
    });

    describe("updateProject", () => {
        test("should update", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            const rs: boolean = await projectService.updateProject(testProject.userName, testProject.id, "Static Test Generator");
            expect(rs).toBeTruthy();
            await unit.complete(true);
        });

        test("should not update empty project name", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            await expect( async () => {
                const projectService: ProjectService = new ProjectService(unit);
                await projectService.updateProject(testProject.userName, testProject.id, "");
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_Name');
            await unit.complete(false);
        });

        test("should not update to existing project name", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            await expect( async () => {
                const projectService: ProjectService = new ProjectService(unit);
                await projectService.updateProject(testProject.userName, testProject.id, "AI Sign Language");
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_Name');
            await unit.complete(false);
        });
    });

    describe("updateProjectTheme", async () => {
        const unit: Unit = await Unit.create(false);
        const themeService: ThemeService = new ThemeService(unit);
        await themeService.insertTheme(testThemeData);
        unit.complete(true);
    

        test("should update", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            const rs: boolean = await projectService.updateProjectTheme(testProject.userName, testProject.id, 2);
            expect(rs).toBeTruthy();
            await unit.complete(true);
        });

        test("should not update nonexisting theme id", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            await expect( async () => {
                const projectService: ProjectService = new ProjectService(unit);
                await projectService.updateProjectTheme(testProject.userName, testProject.id, 3);
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: FK_Theme');
            await unit.complete(false);
        });
    });

    describe("deleteProject", () => {

    });
});