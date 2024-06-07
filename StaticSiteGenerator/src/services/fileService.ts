import {ServiceBase} from "../database/serviceBase";
import {Unit} from "../database/unit";
import {Statement} from "sqlite";

export class FileService extends ServiceBase {

        public constructor(unit: Unit) {
            super(unit);
        }

        public async selectFilesOfProject(projectId: number): Promise<File[]> {
            const stmt: Statement = await this.unit.prepare(`
                select id, file_index, name from File 
                where project_id = ?1`,
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
            const stmt: Statement = await this.unit.prepare(`
                select max(file_index) as maxIndex 
                from File 
                where project_id = ?1`, {1: projectId});
            const maxIndex: number = (await stmt.get<{maxIndex: number}>())?.maxIndex ?? -1;
            const stmt2: Statement = await this.unit.prepare(`
                insert into File (file_index, name, project_id) 
                values (?1, ?2, ?3)`, {1: maxIndex + 1, 2: fileName, 3: projectId});
            return await this.executeStmt(stmt2);
        }

        public async deleteFile(fileId: number): Promise<boolean> {
            let stmt: Statement = await this.unit.prepare(`select file_index, project_id from File where id = ?1`, {1: fileId});
            const fileData: {file_index: number, project_id: number} | undefined =
                await stmt.get<{file_index: number, project_id: number}>();
            if (!fileData) {
                return false;
            }
            stmt = await this.unit.prepare(`
                delete from File 
                where id = ?1`,
                { 1: fileId });
            await this.shiftFileIndices(fileData.project_id, fileData.file_index + 1, -1);
            return await this.executeStmt(stmt);
        }

        public async updateFileIndex(userName: string, fileId: number, newIndex: number): Promise<boolean> {
            return false;
        }

        public async getFilePath(fileId: number): Promise<string> {
            return "";
        }

        private async shiftFileIndices(projectId: number, start: number, delta: number): Promise<boolean> {
            const stmt: Statement = await this.unit.prepare(`
                update File set file_index = file_index + ?1 
                where file_index >= ?2 and project_id = ?3`,
                {1: delta, 2: start, 3: projectId});
            return await this.executeStmt(stmt);
        }
}

export interface File {
    id: number,
    index: number,
    name: string
}