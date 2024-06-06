import {ServiceBase} from "../database/serviceBase";
import {Unit} from "../database/unit";

export class FileService extends ServiceBase {

        public constructor(unit: Unit) {
            super(unit);
        }

        public async selectFilesOfProject(userName: string, projectId: number): Promise<File[]> {
            return [];
        }

        public async insertFile(userName: string, projectId: number, fileName: string): Promise<boolean> {
            return false;
        }

        public async deleteFile(userName: string, projectId: number, fileId: number): Promise<boolean> {
            return false;
        }

        public async updateFileIndex(userName: string, projectId: number, fileId: number, newIndex: number): Promise<boolean> {
            return false;
        }

        public async getFilePath(fileId: number): Promise<string> {
            return "IF210046/data/";
        }
}

export interface File {
    id: number,
    index: number,
    name: string
}