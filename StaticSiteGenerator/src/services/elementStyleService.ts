import { Statement } from "sqlite";
import { ServiceBase } from "../database/serviceBase";
import { Unit } from "../database/unit";

export class ElementStyleService extends ServiceBase{
    public constructor(unit: Unit){
        super(unit);
    }

    public async selectAllElementStyles(id: number): Promise<ElementStyle[]>{
        const stmt: Statement = await this.unit.prepare(`select * from Element_Style where theme_id = ?1`, {1: id});
        return await stmt.all<ElementStyle[]>();
    }

    public async insertElementStyle(elementStyle: ElementStyleData): Promise<boolean>{
        const stmt: Statement = await this.unit.prepare(`insert into Element_Style (selector, theme_id) values (?1, ?2)`, {1: elementStyle.selector, 2: elementStyle.themeId});
        return await this.executeStmt(stmt);
    }

    public async updateElementStyle(selector: string, id: number): Promise<boolean>{
        const stmt: Statement = await this.unit.prepare(`update Element_Style set selector = ?1 where id = ?2`, {1: selector, 2: id});
        return await this.executeStmt(stmt);
    }

    public async deleteElementStyle(id: number): Promise<boolean>{
        const stmt: Statement = await this.unit.prepare(`delete from Element_Style where id = ?1`, {1: id});
        return await this.executeStmt(stmt);
    }

    public async ownsElementStyle(userName: string, elementStyleId: number): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare(`
            select count(*) as count 
            from Element_Style e
            inner join Theme t on e.theme_id = t.id
            where t.user_name = ?1 and e.id = ?2`,
            {1: userName, 2: elementStyleId });
        return ((await stmt.get<{count: number}>())?.count ?? 0) >= 1;
    }

    public async isAllowedToUseElementStyle(userName: string, elementStyleId: number): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare(`
            select count(*) as count 
            from Element_Style e
            inner join Theme t on e.theme_id = t.id
            where e.id = ?1 and (t.user_name = ?2 or t.is_public != 0)`,
            {1: elementStyleId, 2: userName});
        return ((await stmt.get<{count: number}>())?.count ?? 0) >= 1;
    }
}

export interface ElementStyleData{
    selector: string,
    themeId: number
};

export interface ElementStyle extends ElementStyleData{
    id: number
};