import {ServiceBase} from "../database/serviceBase";
import {Unit} from "../database/unit";
import {Statement} from "sqlite";

export class ThemeService extends ServiceBase {
    public constructor(unit: Unit) {
        super(unit);
    }

    public async selectPublicThemes(): Promise<Theme[]> {
        const stmt: Statement = await this.unit.prepare(`
            select id as id, name as name, user_name as userName, is_public as isPublic 
            from Theme where is_public != 0
            `);
        return this.normalizeThemes(await stmt.all<Theme[]>());
    }

    public async selectThemesByUser(userName: string): Promise<Theme[]> {
        const stmt: Statement = await this.unit.prepare(`
            select id as id, name as name, user_name as userName, is_public as isPublic 
            from Theme where user_name = ?1`,
            {1: userName});
        return this.normalizeThemes(await stmt.all<Theme[]>());
    }

    public async insertTheme(theme: ThemeData): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare("insert into Theme (user_name, name, is_public) VALUES (?1, ?2, ?3)",
            {1: theme.userName, 2: theme.name, 3: theme.isPublic});
        return await this.executeStmt(stmt);
    }

    public async updateThemeName(userName: string, id: number, newName: string): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare("update Theme set name = ?1 where user_name = ?2 and id = ?3",
            {1: newName, 2: userName, 3: id});
        return await this.executeStmt(stmt);
    }

    public async updateThemePublic(userName: string, id: number, isPublic: boolean): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare("update Theme set is_public = ?1 where user_name = ?2 and id = ?3",
            {1: isPublic ? 1 : 0, 2: userName, 3: id});
        return await this.executeStmt(stmt);
    }

    public async deleteTheme(userName: string, id: number): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare("delete from Theme where user_name = ?1 and id = ?2",
            {1: userName, 2: id});
        return await this.executeStmt(stmt);
    }

    private normalizeThemes(themes: Theme[]): Theme[] {
        return themes.map(t => {
            return {
                id: t.id,
                userName: t.userName,
                name: t.name,
                isPublic: !!t.isPublic // intended because in the database isPublic is stored as 0 or 1
            };
        });
    }
}

export interface ThemeData {
    userName: string;
    name: string;
    isPublic: boolean;
}

export interface Theme extends ThemeData {
    id: number;
}