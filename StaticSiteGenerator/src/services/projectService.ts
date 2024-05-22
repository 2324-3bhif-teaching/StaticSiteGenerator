import {ServiceBase} from "../database/serviceBase";
import {Unit} from "../database/unit";
import {Statement} from "sqlite";

export class ProjectService extends ServiceBase {
    public constructor(unit: Unit) {
        super(unit);
    }

    public async getProjectNamesByUser(userName: string): Promise<Project[]> {
        throw new Error("Not Implemented");
    }
}

export interface Project {
    name: string;
    userName: string;
    themeName: string;
    themeOwner: string;
}