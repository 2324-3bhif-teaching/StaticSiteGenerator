import { DefaultTheme } from "../../src/constants";
import { Unit } from "../../src/database/unit";
import { Project, ProjectService } from "../../src/services/projectService";
import { ThemeData, ThemeService } from "../../src/services/themeService";
import { setupTestData } from "../database/testData";

const testProjectData: Project[] = [
    { id: 1, name: "Static Site Generator", userName: "SSG", themeId: 1 },
    { id: 2, name: "AI Sign Language", userName: "SSG", themeId: 1 },
    { id: 3, name: "Inventar", userName: "SSG", themeId: 1 },
    { id: 4, name: "Dashboard", userName: "SSG", themeId: 1 }
];

const testThemeData: ThemeData = { userName: "user1", name: "theme1", isPublic: true };

describe("ProjectService", () => {
    beforeEach(async () => {
        await setupTestData();
        const unit: Unit = await Unit.create(false);
        const themeService: ThemeService = new ThemeService(unit);

        await themeService.insertTheme({
            userName: DefaultTheme.userName,
            name: DefaultTheme.name,
            isPublic: DefaultTheme.isPublic
        });
        await themeService.insertTheme(testThemeData);

        await unit.complete(true);
    });
    describe("insertProject", () => {
        test("should create projects", async () => {
            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            for (const testProject of testProjectData) {
                const res: boolean = await projectService.insertProject(testProject.userName, testProject.name);
                expect(res).toBeTruthy();
            }
            await unit.complete(true);
        });

        test("should not create duplicate project", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            await projectService.insertProject(testProject.userName, testProject.name);
            await expect(async () => {
                await projectService.insertProject(testProject.userName, testProject.name);
            }).rejects.toThrow('SQLITE_CONSTRAINT: UNIQUE constraint failed: Project.name, Project.user_name');
            expectToBeSame(await projectService.selectAllProjects(testProjectData[0].userName), [testProjectData[0]]);
            await unit.complete(true);
        });

        test("should not create with empty project name", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            await expect(async () => {
                await projectService.insertProject(testProject.userName, "");
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_Name');
            await expect(async () => {
                await projectService.insertProject(testProject.userName, "   ");
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_Name');
            expectToBeSame(await projectService.selectAllProjects(testProjectData[0].userName), []);
            await unit.complete(true);
        });

        test("should not create with empty user name", async () => {
            const testProject: Project = testProjectData[0];
            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            await expect(async () => {
                await projectService.insertProject("", testProject.name);
            }).rejects.toThrow(new Error('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_User_Name'));
            await expect(async () => {
                await projectService.insertProject("   ", testProject.name);
            }).rejects.toThrow(new Error('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_User_Name'));
            expectToBeSame(await projectService.selectAllProjects(testProjectData[0].userName), []);
            await unit.complete(true);
        });

        test("should create with default theme", async () => {
            await fillTestProjects();

            const unit = await Unit.create(true);
            const projectService = new ProjectService(unit);
            const projects: Project[] = await projectService.selectAllProjects(testProjectData[0].userName);
            await unit.complete();
            for (const project of projects) {
                expect(project.themeId).toBe(DefaultTheme.id);
            }
        });
    });

    describe("selectAllProjects", () => {
        test("should select all", async () => {
            await fillTestProjects();

            const unit: Unit = await Unit.create(true);
            const projectService: ProjectService = new ProjectService(unit);
            const selectedProjects: Project[] = await projectService.selectAllProjects(testProjectData[0].userName);
            await unit.complete();
            expectToBeSame(selectedProjects, testProjectData);
        });
    });

    describe("updateProject", () => {
        test("should update", async () => {
            const testProject: Project = testProjectData[0];
            const newName: string = "Static Test Generator";

            await insertProject(testProject);

            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            const rs: boolean = await projectService.updateProject(testProject.userName, testProject.id, newName);
            expect(rs).toBeTruthy();

            const projects: Project[] = await projectService.selectAllProjects(testProject.userName);
            await unit.complete(true);
            expect(projects.length).toBe(1);
            expect(projects[0].name).toBe(newName);
        });

        test("should not update empty project name", async () => {
            const testProject: Project = testProjectData[0];

            await insertProject(testProject);

            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            await expect(async () => {
                await projectService.updateProject(testProject.userName, testProject.id, "");
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Project_Name');
            const projects: Project[] = await projectService.selectAllProjects(testProject.userName);
            await unit.complete(true);
            expect(projects.length).toBe(1);
            expect(projects[0].name).toBe(testProject.name);
        });

        test("should not update to existing project name", async () => {
            const testProject: Project = testProjectData[0];

            await fillTestProjects();

            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            await expect(async () => {
                await projectService.updateProject(testProject.userName, testProject.id, "AI Sign Language");
            }).rejects.toThrow('SQLITE_CONSTRAINT: UNIQUE constraint failed: Project.name, Project.user_name');
            const projects: Project[] = await projectService.selectAllProjects(testProject.userName);
            await unit.complete(true);
            expect(projects.length).toBe(4);
            expect(projects[0].name).toBe(testProject.name);
            expectToBeSame(projects, testProjectData);
        });
    });

    describe("updateProjectTheme", () => {

        test("should update", async () => {
            const testProject: Project = testProjectData[0];
            const newId: number = 2;

            await insertProject(testProject);

            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            const rs: boolean = await projectService.updateProjectTheme(testProject.userName, testProject.id, newId);
            expect(rs).toBeTruthy();

            const projects: Project[] = await projectService.selectAllProjects(testProject.userName);
            await unit.complete(true);
            expect(projects.length).toBe(1);
            expect(projects[0].themeId).toBe(newId);
        });

        test("should not update nonexisting theme id", async () => {
            const testProject: Project = testProjectData[0];

            await insertProject(testProject);

            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            await expect(async () => {
                await projectService.updateProjectTheme(testProject.userName, testProject.id, 3);
            }).rejects.toThrow('SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
            const projects: Project[] = await projectService.selectAllProjects(testProject.userName);
            await unit.complete(true);
            expect(projects.length).toBe(1);
            expect(projects[0].themeId).toBe(testProject.themeId);
        });
    });

    describe("deleteProject", () => {
        test("should delete", async () => {
            const testProject: Project = testProjectData[1];

            await insertProject(testProject);

            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            const rs: boolean = await projectService.deleteProject(testProject.userName, testProject.id - 1);
            expect(rs).toBeTruthy();

            const projects: Project[] = await projectService.selectAllProjects(testProject.userName);
            await unit.complete(true);
            expect(projects.length).toBe(0);
        });

        test("should not delete nonexisting project", async () => {
            const testProject: Project = testProjectData[0];

            await insertProject(testProject);

            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            const rs: boolean = await projectService.deleteProject(testProject.userName, testProject.id + 1);
            expect(rs).toBeFalsy();

            const projects: Project[] = await projectService.selectAllProjects(testProject.userName);
            await unit.complete(true);
            expect(projects.length).toBe(1);
        });
    });

    describe("ownsProject", () => {
        test("should own project", async () => {
            await insertProject(testProjectData[0]);

            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            const rs: boolean = await projectService.ownsProject(testProjectData[0].userName, testProjectData[0].id);
            await unit.complete(true);
            expect(rs).toBeTruthy();
        });
        test("should not own project", async () => {
            await insertProject(testProjectData[0]);

            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            const rs: boolean = await projectService.ownsProject("someone", testProjectData[0].id);
            await unit.complete(true);
            expect(rs).toBeFalsy();
        });
        test("should not own non-existing project", async () => {
            const unit: Unit = await Unit.create(false);
            const projectService: ProjectService = new ProjectService(unit);
            const rs: boolean = await projectService.ownsProject(testProjectData[0].userName, testProjectData[0].id);
            await unit.complete(true);
            expect(rs).toBeFalsy();
        });
    });
});

function expectToBeSame(arr1: Project[], arr2: Project[]): void {
    expect(arr1.length).toBe(arr2.length);
    for (let i: number = 0; i < arr1.length; i++) {
        expect(arr1[i].id).toBe(arr2[i].id);
        expect(arr1[i].name).toBe(arr2[i].name);
        expect(arr1[i].themeId).toBe(arr2[i].themeId);
        expect(arr1[i].userName).toBe(arr2[i].userName);
    }
}

async function insertProject(project: Project){
    const unit: Unit = await Unit.create(false);
    const projectService: ProjectService = new ProjectService(unit);
    await projectService.insertProject(project.userName, project.name);
    await unit.complete(true);
}

async function fillTestProjects(){
    const unit: Unit = await Unit.create(false);
    const projectService: ProjectService = new ProjectService(unit);
    for (const project of testProjectData) {
        await projectService.insertProject(project.userName, project.name);
    }
    await unit.complete(true);
}