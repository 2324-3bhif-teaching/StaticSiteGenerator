import {ServiceBase} from "../database/serviceBase";
import {Unit} from "../database/unit";
import {Statement} from "sqlite";

export class ThemeService extends ServiceBase {
    public constructor(unit: Unit) {
        super(unit);
    }

    public async getPublicThemes(): Promise<Theme[]> {
        const stmt: Statement = await this.unit.prepare("select * from Theme where isPublic != 0");
        return this.normalizeThemes(await stmt.all<Theme[]>());
    }

    public async getThemesByUser(userName: string): Promise<Theme[]> {
        const stmt: Statement = await this.unit.prepare("select * from Theme where userName = ?1", {1: userName});
        return this.normalizeThemes(await stmt.all<Theme[]>());
    }

    public async createTheme(theme: Theme): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare("insert into Theme (userName, name, isPublic) VALUES (?1, ?2, ?3)",
            {1: theme.userName, 2: theme.name, 3: theme.isPublic});
        return await this.executeStmt(stmt);
    }

    public async updateThemeName(userName: string, name: string, newName: string): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare("update Theme set name = ?1 where userName = ?2 and name = ?3",
            {1: newName, 2: userName, 3: name});
        return await this.executeStmt(stmt);
    }

    public async updateThemePublic(userName: string, name: string, isPublic: boolean): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare("update Theme set isPublic = ?1 where userName = ?2 and name = ?3",
            {1: isPublic ? 1 : 0, 2: userName, 3: name});
        return await this.executeStmt(stmt);
    }

    public async deleteTheme(userName: string, name: string): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare("delete from Theme where userName = ?1 and name = ?2",
            {1: userName, 2: name});
        return await this.executeStmt(stmt);
    }

    private normalizeThemes(themes: Theme[]): Theme[] {
        return themes.map(t => {
            return {
                userName: t.userName,
                name: t.name,
                isPublic: !!t.isPublic // intended because in the database isPublic is stored as 0 or 1
            };
        });
    }
}

export interface Theme {
    userName: string;
    name: string;
    isPublic: boolean;
}