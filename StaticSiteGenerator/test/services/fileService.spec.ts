import {setupTestData} from "../database/testData";
import {Unit} from "../../src/database/unit";
import {ProjectService} from "../../src/services/projectService";
import {FileService, File} from "../../src/services/fileService";
import {ThemeService} from "../../src/services/themeService";
import {DefaultTheme, FileLocation} from "../../src/constants";
import { join } from "path";

const files: File[] = [
    {id: 1, index: 0, name: "test1"},
    {id: 2, index: 1, name: "test2"},
    {id: 3, index: 2, name: "test3"},
    {id: 4, index: 3, name: "test4"},
    {id: 5, index: 4, name: "test5"}
];

const shiftedFiles: File[] = [
    {id: 1, index: 0, name: "test1"},
    {id: 2, index: 1, name: "test2"},
    {id: 4, index: 2, name: "test4"},
    {id: 5, index: 3, name: "test5"}
];

const updatedFiles: File[] = [
    {id: 1, index: 0, name: "test1"},
    {id: 3, index: 1, name: "test3"},
    {id: 4, index: 2, name: "test4"},
    {id: 2, index: 3, name: "test2"},
    {id: 5, index: 4, name: "test5"}
];

const updatedFiles2: File[] = [
        {id: 2, index: 0, name: "test2"},
        {id: 1, index: 1, name: "test1"},
        {id: 3, index: 2, name: "test3"},
        {id: 4, index: 3, name: "test4"},
        {id: 5, index: 4, name: "test5"}
    ];

const updatedFiles3: File[] = [
    {id: 1, index: 0, name: "test1"},
    {id: 3, index: 1, name: "test3"},
    {id: 4, index: 2, name: "test4"},
    {id: 5, index: 3, name: "test5"},
    {id: 2, index: 4, name: "test2"}
];

const projectId: number = 1;

describe("FileService", (): void => {
    beforeEach(async (): Promise<void> => {
        await setupTestData();
        const unit: Unit = await Unit.create(false);

        const themeService: ThemeService = new ThemeService(unit);
        await themeService.insertTheme(DefaultTheme);

        const projectService: ProjectService = new ProjectService(unit);
        await projectService.insertProject("testUser", "testProject");

        await unit.complete(true);
    });

    describe("insertFile", (): void => {
        test('should insert a file', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            await insertFiles(unit);
            const fileService: FileService = new FileService(unit);

            const projectService: ProjectService = new ProjectService(unit);
            await projectService.insertProject("testUser2", "testProject2");

            const result: boolean = await fileService.insertFile(2, "test1");
            await unit.complete(true);
            expect(result).toBeTruthy();
            expect(await selectFiles(projectId)).toStrictEqual(files);
        });
        test('should insert a file with existing name', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            const fileService: FileService = new FileService(unit);
            expect(await fileService.insertFile(projectId, files[0].name)).toBeTruthy();
            await expect(async (): Promise<void> => {
                await fileService.insertFile(projectId, files[0].name)
            }).rejects.toThrow('SQLITE_CONSTRAINT: UNIQUE constraint failed: File.name, File.project_id');
            await unit.complete(true);
            expect(await selectFiles(projectId)).toStrictEqual([files[0]]);
        });
    });

    describe("deleteFile", (): void => {
        test('should delete a file', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            await insertFiles(unit);
            const fileService: FileService = new FileService(unit);
            expect(await fileService.deleteFile(3)).toBeTruthy();
            await unit.complete(true);
            expect(await selectFiles(projectId)).toStrictEqual(shiftedFiles);
        });
        test('should not delete a non-existing file', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            const fileService: FileService = new FileService(unit);
            const result: boolean = await fileService.deleteFile(1);
            await unit.complete(true);
            expect(result).toBeFalsy();
        });
    });

    describe("updateFileIndex", (): void => {
        test('should update a file index', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            await insertFiles(unit);
            const fileService: FileService = new FileService(unit);
            const result: boolean = await fileService.updateFileIndex(2, 3);
            await unit.complete(true);
            expect(result).toBeTruthy();
            expect(await selectFiles(projectId)).toStrictEqual(updatedFiles);
        });
        test('should not update a non-existing file', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            const fileService: FileService = new FileService(unit);
            const result: boolean = await fileService.updateFileIndex(1, 0);
            await unit.complete(true);
            expect(result).toBeFalsy();
        });
        test('should not update if index doesnt change', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            await insertFiles(unit);
            const fileService: FileService = new FileService(unit);
            const result: boolean = await fileService.updateFileIndex(2, 1);
            await unit.complete(true);
            expect(result).toBeTruthy();
            expect(await selectFiles(projectId)).toStrictEqual(files);
        });
        test('should clamp index to 0', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            await insertFiles(unit);
            const fileService: FileService = new FileService(unit);
            const result: boolean = await fileService.updateFileIndex(2, -1);
            await unit.complete(true);
            expect(result).toBeTruthy();
            expect(await selectFiles(projectId)).toStrictEqual(updatedFiles2);
        });
        test('should clamp index to max', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            await insertFiles(unit);
            const fileService: FileService = new FileService(unit);
            const result: boolean = await fileService.updateFileIndex(2, 5);
            await unit.complete(true);
            expect(result).toBeTruthy();
            expect(await selectFiles(projectId)).toStrictEqual(updatedFiles3);
        });
    });

    describe("getFilePath", (): void => {
        test('should get file path', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            await insertFiles(unit);
            const fileService: FileService = new FileService(unit);
            const result: string | null = await fileService.getFilePath(1);
            await unit.complete(true);
            expect(result).toBe(join(FileLocation, "testUser/1/test1"));
        });
        test('should not get file path of non-existing file', async (): Promise<void> => {
            const unit: Unit = await Unit.create(false);
            const fileService: FileService = new FileService(unit);
            const result: string | null = await fileService.getFilePath(0);
            await unit.complete(true);
            expect(result).toBe(null);
        });
    });
});

async function insertFiles(unit: Unit): Promise<void> {
    const fileService: FileService = new FileService(unit);
    for (const file of files) {
        expect(await fileService.insertFile(projectId, file.name)).toBeTruthy();
    }
}

async function selectFiles(projectId: number): Promise<File[]> {
    const unit: Unit = await Unit.create(true);
    const fileService: FileService = new FileService(unit);
    const files: File[] = await fileService.selectFilesOfProject(projectId);
    await unit.complete();
    return files;
}