import { Statement } from "sqlite";
import { ServiceBase } from "../database/serviceBase";
import { Unit } from "../database/unit";

export class StyleService extends ServiceBase{
    public constructor(unit: Unit){
        super(unit);
    }

    public async selectAll(elementStyleId: number): Promise<Style[]>{
        const stmt: Statement = await this.unit.prepare(`select * from Style where element_style_id = ?1`, {1: elementStyleId});
        return await stmt.all<Style[]>();
    }

    public async insertStyle(style: StyleData): Promise<boolean>{
        const stmt: Statement = await this.unit.prepare(`insert into Style (property, value, element_style_id) values (?1, ?2, ?3)`, {1: style.property, 2: style.value, 3: style.elementStyleId});
        return await this.executeStmt(stmt);
    }

    public async updateStyleName(id: number, newName: string): Promise<boolean>{
        const stmt: Statement = await this.unit.prepare(`update Style set property = ?1 where id = ?2`, {1: newName, 2: id});
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
}

export interface StyleData{
    elementStyleId: number,
    property: string,
    value: string
}

export interface Style extends StyleData{
    id: number
}