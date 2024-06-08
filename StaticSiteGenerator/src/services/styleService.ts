import { Statement } from "sqlite";
import { ServiceBase } from "../database/serviceBase";
import { Unit } from "../database/unit";

export class StyleService extends ServiceBase{
    public constructor(unit: Unit){
        super(unit);
    }

    public async selectAll(elementStyleId: number): Promise<Style[]>{
        const stmt: Statement = await this.unit.prepare(`select id, property, value, element_style_id as elementStyleId from Style where element_style_id = ?1`, {1: elementStyleId});
        return await stmt.all<Style[]>();
    }

    public async insertStyle(style: StyleData): Promise<boolean>{
        const stmt: Statement = await this.unit.prepare(`insert into Style (property, value, element_style_id) values (?1, ?2, ?3)`, {1: style.property, 2: style.value, 3: style.elementStyleId});
        return await this.executeStmt(stmt);
    }

    public async updateStyleProperty(id: number, newProperty: string): Promise<boolean>{
        const stmt: Statement = await this.unit.prepare(`update Style set property = ?1 where id = ?2`, {1: newProperty, 2: id});
        return await this.executeStmt(stmt);
    }

    public async updateStyleValue(id: number, newValue: string): Promise<boolean>{
        const stmt: Statement = await this.unit.prepare(`update Style set value = ?1 where id = ?2`, {1: newValue, 2: id});
        return await this.executeStmt(stmt);
    }

    public async deleteStyle(id: number){
        const stmt: Statement = await this.unit.prepare(`delete from Style where id = ?1`, {1: id});
        return await this.executeStmt(stmt);
    }

    public async ownsStyle(userName: string, styleId: number): Promise<boolean> {
        const stmt: Statement = await this.unit.prepare(`
            select count(*) as count 
            from Style s
            inner join Element_Style e on s.element_style_id = e.id
            inner join Theme t on e.theme_id = t.id
            where t.user_name = ?1 and s.id = ?2`,
            {1: userName, 2: styleId});
        return ((await stmt.get<{count: number}>())?.count ?? 0) >= 1;
    }
}

export interface StyleData{
    elementStyleId: number,
    property: string,
    value: string
}

export interface Style extends StyleData{
    id: number
}