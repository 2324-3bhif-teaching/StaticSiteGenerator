import { DefaultTheme } from "../constants";
import {ServiceBase} from "../database/serviceBase";
import {Unit} from "../database/unit";
import {Statement} from "sqlite";

export class ProjectService extends ServiceBase {
    public constructor(unit: Unit) {
        super(unit);
    }

    public async selectAllProjects(userName: string): Promise<Project[]> {
        const stmt: Statement = await this.unit.prepare(`select name, id, user_name as userName, theme_id as themeId from Project where user_name = ?1`, {1: userName});
        return await stmt.all<Project[]>();
    }

    public async insertProject(userName: string, projectName: string): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare(`insert into Project (name, user_name, theme_id) values (?1, ?2, ?3)`, {1: projectName, 2: userName, 3: DefaultTheme.id});
        return await this.executeStmt(stmt);
    }

    public async updateProject(userName: string, id: number, newName: string): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare(`update Project set name = ?1 where user_name = ?2 and id = ?3`, {1: newName, 2: userName, 3: id});
        return await this.executeStmt(stmt);
    }

    public async updateProjectTheme(userName: string, id: number, themeId: number): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare(`update Project set theme_id = ?1 where user_name = ?2 and id = ?3`, {1: themeId, 2: userName, 3: id});
        return await this.executeStmt(stmt);
    }

    public async deleteProject(userName: string, id: number): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare(`delete from Project where user_Name = ?1 and id = ?2`, {1: userName, 2: id});
        return await this.executeStmt(stmt);
    }
}

export interface Project {
    id: number;
    name: string;
    userName: string;
    themeId: number;
}