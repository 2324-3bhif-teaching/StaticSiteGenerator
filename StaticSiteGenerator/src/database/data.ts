import { Database as Driver } from "sqlite3";
import { open, Database } from "sqlite";
import {Theme} from "../theme";
import { DefaultTheme } from "../constants";

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
            id integer primary key autoincrement,
            name text not null,
            user_name text not null,
            is_public integer not null,
            constraint CK_Theme_User_Name check (trim(user_name) != ''),
            constraint CK_Theme_Name check (trim(name) != ''),
            constraint CK_Theme_Unique unique (name, user_name)
        ) strict`);

        await connection.run(`create table if not exists Element_Style (
            id integer primary key autoincrement,
            selector text not null,
            theme_id integer not null,
            constraint FK_Theme foreign key (theme_id) references Theme(id) on delete cascade,
            constraint CK_ElementStyle_Selector check (trim(selector) != '')
        ) strict`);

        await connection.run(`create table if not exists Style(
            id integer primary key autoincrement,
            property text not null,
            value text not null,
            element_style_id integer not null,
            constraint FK_Element_Style foreign key (element_style_id) references Element_Style(id) on delete cascade,
            constraint CK_Style_Property check (trim(property) != ''),
            constraint CK_Style_Value check (trim(value) != '')
        ) strict`);

        await connection.run(`create table if not exists Project (
            id integer primary key autoincrement,
            name text not null,
            user_name text not null,
            theme_id integer not null,
            constraint FK_Theme foreign key (theme_id) references Theme(id),
            constraint CK_Project_Name check (trim(name) != ''),
            constraint CK_Project_User_Name check (trim(user_name) != ''),
            constraint CK_Project_Unique unique (name, user_name)
        ) strict`);

        await connection.run(`create table if not exists File (
            id integer primary key autoincrement,
            file_index integer not null,
            name text not null,
            project_id integer not null,
            constraint FK_Project foreign key (project_id) references Project(id) on delete cascade,
            constraint CK_File_Name check (trim(name) != ''),
            constraint CK_Unique_File_Name unique (name, project_id)
        ) strict`);

        this.tableInitDone = true;
    }

    public static async ensureTablesCleared(connection: Database): Promise<void> {
        try {
            await DB.beginTransaction(connection);
            await connection.run('drop table Element_Style');
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
        const defTheme = await connection.get(`Select Count(*) as cnt from theme where name = '${DefaultTheme.name}' and user_name = '${DefaultTheme.userName}'`);

        if(defTheme.cnt === 1) {
            return;
        }

        await DB.beginTransaction(connection);
        try {
            await connection.run(`Insert into THEME (user_name, name, is_public) Values ('${DefaultTheme.userName}','${DefaultTheme.name}',${DefaultTheme.isPublic ? 1 : 0})`);
            await DB.commitTransaction(connection);
        }
        catch (error)
        {
            await DB.rollbackTransaction(connection);
        }
    }
}