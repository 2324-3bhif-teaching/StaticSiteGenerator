import {ServiceBase} from "../database/serviceBase";
import {Unit} from "../database/unit";
import {Statement} from "sqlite";
import { join } from "path";
import {FileLocation} from "../constants";

export class FileService extends ServiceBase {
    public constructor(unit: Unit) {
        super(unit);
    }

    public async selectFilesOfProject(projectId: number): Promise<File[]> {
        const stmt: Statement = await this.unit.prepare(`
            select id, file_index, name from File 
            where project_id = ?1
            order by file_index`,
            {1: projectId});
        return (await stmt.all<{id: number, file_index: number, name: string}[]>())
            .map(file => {
                return {
                    id: file.id,
                    index: file.file_index,
                    name: file.name
                };
            });
    }

    public async insertFile(projectId: number, fileName: string): Promise<boolean> {
        const maxIndex: number = await this.getMaxIndex(projectId) ?? -1;
        const stmt: Statement = await this.unit.prepare(`
            insert into File (file_index, name, project_id) 
            values (?1, ?2, ?3)`, {1: maxIndex + 1, 2: fileName, 3: projectId});
        return await this.executeStmt(stmt);
    }

    public async deleteFile(fileId: number): Promise<boolean> {
        const fileData: FileData | null = await this.getFileData(fileId);
        if (fileData === null) {
            return false;
        }

        const stmt: Statement = await this.unit.prepare(`
            delete from File 
            where id = ?1`,
            { 1: fileId });
        const result: boolean = await this.executeStmt(stmt);

        await this.shiftFileIndices(fileData.project_id, -1, fileData.file_index + 1);

        return result
    }

    public async updateFileIndex(fileId: number, newIndex: number): Promise<boolean> {
        const fileData: FileData | null = await this.getFileData(fileId);
        if (fileData === null) {
            return false;
        }
        newIndex = Math.min(Math.max(newIndex, 0), await this.getMaxIndex(fileData.project_id) ?? 0);
        if (fileData.file_index === newIndex) {
            return true;
        }

        const delta: number = fileData.file_index < newIndex ? -1 : 1;
        const start: number = fileData.file_index < newIndex ? fileData.file_index + 1 : newIndex;
        const end: number = fileData.file_index < newIndex ? newIndex : fileData.file_index - 1;
        await this.shiftFileIndices(fileData.project_id, delta, start, end);

        const stmt: Statement = await this.unit.prepare(`
            update File set file_index = ?1 
            where id = ?2`,
            {1: newIndex, 2: fileId});
        return await this.executeStmt(stmt);
    }

    public async ownsFile(userName: string, fileId: number): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare(`
            select count(*) as count from File f
            inner join Project p on p.id = f.project_id
            where f.id = ?1 and p.user_name = ?2`,
            {1: fileId, 2: userName});
        return ((await stmt.get<{count: number}>())?.count ?? 0) >= 1;
    }

    public async getFilePath(fileId: number): Promise<string | null> {
        const stmt: Statement = await this.unit.prepare(`
            select p.user_name as userName, f.project_id as projectId, f.name as name from File f
            inner join Project p on p.id = f.project_id
            where f.id = ?1`,
            {1: fileId});
        const pathData: FilePathData | undefined = await stmt.get<FilePathData>();
        if (pathData === undefined) {
            return null;
        }
        return join(FileLocation, pathData.userName, pathData.projectId.toString(), pathData.name);
    }

    private async shiftFileIndices(projectId: number, delta: number, start: number, end: number | null = null): Promise<boolean> {
        let stmt: Statement;
        if (end === null) {
            stmt = await this.unit.prepare(`
            update File set file_index = file_index + ?1 
            where file_index >= ?2
            and project_id = ?3`,
            {1: delta, 2: start, 3: projectId});
        }
        else {
            stmt = await this.unit.prepare(`
            update File set file_index = file_index + ?1 
            where file_index between ?2 and ?3 
            and project_id = ?4`,
            {1: delta, 2: start, 3: end, 4: projectId});
        }
        return await this.executeStmt(stmt);
    }

    private async getFileData(fileId: number): Promise<FileData | null> {
        let stmt: Statement = await this.unit.prepare(`select file_index, project_id from File where id = ?1`, {1: fileId});
        return await stmt.get<FileData>() ?? null;
    }

    private async getMaxIndex(projectId: number): Promise<number | undefined> {
        const stmt: Statement = await this.unit.prepare(`
            select max(file_index) as maxIndex 
            from File 
            where project_id = ?1`, {1: projectId});
        return (await stmt.get<{maxIndex: number}>())?.maxIndex;
    }
}

interface FilePathData {
    userName: string,
    projectId: number,
    name: string
}

interface FileData {
    file_index: number,
    project_id: number
}

export interface File {
    id: number,
    index: number,
    name: string
}