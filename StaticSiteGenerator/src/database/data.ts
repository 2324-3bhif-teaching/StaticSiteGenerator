import { Database as Driver } from "sqlite3";
import { open, Database } from "sqlite";
import {Theme} from "../theme";

export const dbFileName = 'StaticSiteGenerator.db';

export class DB {
    public static dbFilePath: string = dbFileName;
    private static tableInitDone = false;

    public static readonly SystemUserName = "StaticSiteGenerator";
    public static async createDBConnection(): Promise<Database> {
        const db = await open({
            filename: `./${DB.dbFilePath}`,
            driver: Driver
        });
        await db.run('PRAGMA foreign_keys = ON');

        await DB.ensureTablesCreated(db);
        return db;
    }

    public static async beginTransaction(connection: Database): Promise<void> {
        await connection.run('begin transaction;');
    }

    public static async commitTransaction(connection: Database): Promise<void> {
        await connection.run('commit;');
    }

    public static async rollbackTransaction(connection: Database): Promise<void> {
        await connection.run('rollback;');
    }

    private static async ensureTablesCreated(connection: Database): Promise<void> {
        if(this.tableInitDone){
            return;
        }

        await connection.run(`create table if not exists Theme (
            userName text not null,
            name text not null,
            isPublic integer not null,
            constraint PK_Theme primary key (name, userName),
            constraint CK_Theme_UserName check (userName != ''),
            constraint CK_Theme_Name check (name != '')
        ) strict`);

        await connection.run(`create table if not exists Style(
            property text not null,
            value text not null,
            constraint PK_Style primary key (property, value),
            constraint CK_Style_Property check (property != ''),
            constraint CK_Style_Value check (value != '')
        ) strict`);

        await connection.run(`create table if not exists ElementStyle (
            tag text not null,
            userName text not null,
            themeName text not null,
            styleProperty text not null,
            styleValue text not null,
            constraint PK_ElementStyle primary key (tag, userName, themeName, styleProperty, styleValue),
            constraint FK_Theme foreign key (userName, themeName) references Theme(userName, name),
            constraint FK_Style foreign key (styleProperty, styleValue) references Style(property, value),
            constraint CK_ElementStyle_Tag check (tag != '')
        ) strict`);

        await connection.run(`create table if not exists Project (
            name text not null,
            userName text not null,
            themeName text not null,
            themeOwner text not null,
            constraint PK_Project primary key (name, userName),
            constraint FK_Theme foreign key (themeName, themeOwner) references Theme(name, userName),
            constraint CK_Project_Name check (name != ''),
            constraint CK_Project_UserName check (userName != '')
        ) strict`);

        await connection.run(`create table if not exists File (
            projectName text not null,
            userName text not null,
            fileIndex integer not null,
            path text not null,
            constraint PK_File primary key (projectName, userName, fileIndex, path),
            constraint FK_Project foreign key (projectName, userName) references Project(name, userName),
            constraint CK_File_Path check (path != '')
        ) strict`);

        this.tableInitDone = true;
    }

    public static async ensureTablesCleared(connection: Database): Promise<void> {
        try {
            await DB.beginTransaction(connection);
            await connection.run('drop table ElementStyle');
            await connection.run('drop table File');
            await connection.run('drop table Project');
            await connection.run('drop table Style');
            await connection.run('drop table Theme');
            await DB.commitTransaction(connection);
            this.tableInitDone = false;
        } catch (error) {
            await DB.rollbackTransaction(connection);
            console.log(error);
        }
    }

    public static async ensureTablesPopulated(connection: Database) : Promise<void> {
        const defTheme = await connection.get(`Select Count(*) as cnt from theme where name = '${Theme.DefaultName}' and userName = '${DB.SystemUserName}'`);

        if(defTheme.cnt === 1) {
            return;
        }

        await DB.beginTransaction(connection);
        try {
            await connection.run(`Insert into THEME (userName, name, isPublic)  Values ('${DB.SystemUserName}','${Theme.DefaultName}',1)`);
            await DB.commitTransaction(connection);
        }
        catch (error)
        {
            await DB.rollbackTransaction(connection);
        }
    }
}