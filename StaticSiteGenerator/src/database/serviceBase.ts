import { Statement } from "sqlite";
import { Unit } from "./unit";

export abstract class ServiceBase {

    protected constructor(protected readonly unit: Unit) {}

    protected async executeStmt(stmt: Statement): Promise<boolean> {
        const result = await stmt.run();
        return result.changes === 1;
    }

    protected static nullIfUndefined<T>(entity: T | undefined): T | null {
        if (entity === undefined) {
            return null;
        }
        return entity;
    }

    protected static unwrapSingle<T>(obj: any | null | undefined, fieldName: string): T | null {
        obj = ServiceBase.nullIfUndefined(obj);
        return obj === null ? null : <T>obj[fieldName];
    }

    protected static unwrapAll<T>(obj: any[], fieldName: string): T[] {
        return obj.map(o => <T>o[fieldName]);
    }
}