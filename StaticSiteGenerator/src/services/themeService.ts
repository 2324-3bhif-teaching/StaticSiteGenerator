import {ServiceBase} from "../database/serviceBase";
import {Unit} from "../database/unit";

export class ThemeService extends ServiceBase {
    public constructor(unit: Unit) {
        super(unit);
    }

    public async getPublicThemes(): Promise<Theme[]> {
        const stmt = await this.unit.prepare("select * from Theme where isPublic != 0");
        return await stmt.all<Theme[]>();
    }

    public async getThemesByUser(userName: string): Promise<Theme[]> {
        return [];
    }

    public async getTheme(userName: string, name: string): Promise<Theme> {
        return {userName: userName, name: name, isPublic: 1};
    }

    public async createTheme(theme: Theme): Promise<boolean> {
        const stmt = await this.unit.prepare("Insert into Theme (userName, name, isPublic) VALUES (?1, ?2, ?3)",
            {1: theme.userName, 2: theme.name, 3: theme.isPublic});
        return await this.executeStmt(stmt);
    }

    public async updateTheme(theme: Theme): Promise<boolean> {
        return false;
    }

    public async deleteTheme(userName: string, name: string): Promise<boolean> {
        return false;
    }
}

export interface Theme {
    userName: string;
    name: string;
    isPublic: number;
}