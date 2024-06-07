import {setupTestData} from "../database/testData";
import {Unit} from "../../src/database/unit";
import {ProjectService} from "../../src/services/projectService";
import {FileService, File} from "../../src/services/fileService";
import {ThemeService} from "../../src/services/themeService";
import {DefaultTheme} from "../../src/constants";
import express from "express";

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

const projectId: number = 1;

describe("FileService", () => {
    beforeEach(async (): Promise<void> => {
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
            await insertFiles(unit);
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
            expect(await selectFiles(projectId)).toStrictEqual([files[0]]);
        });
    });

    describe("deleteFile", () => {
        test('should delete a file', async () => {
            const unit: Unit = await Unit.create(false);
            await insertFiles(unit);
            const fileService: FileService = new FileService(unit);
            expect(await fileService.deleteFile(3)).toBeTruthy();
            await unit.complete(true);
            expect(await selectFiles(projectId)).toStrictEqual(shiftedFiles);
        });
        test('should not delete a non-existing file', async () => {
            const unit: Unit = await Unit.create(false);
            const fileService: FileService = new FileService(unit);
            const result: boolean = await fileService.deleteFile(1);
            await unit.complete(true);
            expect(result).toBeFalsy();
        });
    });

    describe("updateFileIndex", () => {
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