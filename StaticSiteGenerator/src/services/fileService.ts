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

        public async deleteFile(userName: string, projectId: number, fileId: number): Promise<boolean> {
            return false;
        }

        public async updateFileIndex(userName: string, projectId: number, fileId: number, newIndex: number): Promise<boolean> {
            return false;
        }

        public async getFilePath(fileId: number): Promise<string> {
            return "";
        }
}

export interface File {
    id: number,
    index: number,
    name: string
}