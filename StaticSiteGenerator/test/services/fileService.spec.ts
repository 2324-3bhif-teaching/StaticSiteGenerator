import {setupTestData} from "../database/testData";
import {Unit} from "../../src/database/unit";
import {ProjectService} from "../../src/services/projectService";
import {FileService, File} from "../../src/services/fileService";
import {ThemeService} from "../../src/services/themeService";
import {DefaultTheme} from "../../src/constants";

const files: File[] = [
    {id: 1, index: 0, name: "test1"},
    {id: 2, index: 1, name: "test2"},
    {id: 3, index: 2, name: "test3"},
    {id: 4, index: 3, name: "test4"},
    {id: 5, index: 4, name: "test5"}
];

const projectId: number = 1;

describe("FileService", () => {
    beforeEach(async () => {
        await setupTestData();
        const unit: Unit = await Unit.create(false);

        const themeService: ThemeService = new ThemeService(unit);
        await themeService.insertTheme(DefaultTheme);

        const projectService: ProjectService = new ProjectService(unit);
        await projectService.insertProject("test", "test");

        await unit.complete(true);
    });

    describe("insertFile", () => {
        test('should insert a file', async () => {
            const unit: Unit = await Unit.create(false);
            const fileService: FileService = new FileService(unit);
            for (const file of files) {
                expect(await fileService.insertFile(projectId, file.name)).toBeTruthy();
            }
            await unit.complete(true);
            expect(await selectFiles(projectId)).toStrictEqual(files);
        });
        test('should insert a file with existing name', async () => {
            const unit: Unit = await Unit.create(false);
            const fileService: FileService = new FileService(unit);
            expect(await fileService.insertFile(projectId, files[0].name)).toBeTruthy();
            await expect(async (): Promise<void> => {
                await fileService.insertFile(projectId, files[0].name)
            }).rejects.toThrow('SQLITE_CONSTRAINT: UNIQUE constraint failed: File.name, File.project_id');
            await unit.complete(true);
        });
    });
});

async function selectFiles(projectId: number): Promise<File[]> {
    const unit: Unit = await Unit.create(true);
    const fileService: FileService = new FileService(unit);
    const files: File[] = await fileService.selectFilesOfProject(projectId);
    await unit.complete();
    return files;
}