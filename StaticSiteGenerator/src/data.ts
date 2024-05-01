import { Database as Driver } from "sqlite3";
import { open, Database } from "sqlite";
import {Theme} from "./theme";

export const dbFileName = 'StaticSiteGenerator.db';


export class DB {
    public static readonly SystemUserName = "StaticSiteGenerator";
    public static async createDBConnection(): Promise<Database> {
        const db = await open({
            filename: `./${dbFileName}`,
            driver: Driver
        });
        await db.run('PRAGMA foreign_keys = ON');

        await DB.ensureTablesCreated(db);
        await DB.ensureTablesPopulated(db);
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

        await connection.run(`create table if not exists User (
            name text not null,
            password text not null,
            constraint PK_User primary key (name)
        ) strict`);

        await connection.run(`create table if not exists Theme (
            userName text not null,
            name text not null,
            isPublic integer not null,
            constraint PK_Theme primary key (name, userName),
            constraint FK_User foreign key (userName) references User(name)
        ) strict`);

        await connection.run(`create table if not exists Style(
            property text not null,
            value text not null,
            constraint PK_Style primary key (property, value)
        ) strict`);

        await connection.run(`create table if not exists ElementStyles (
            tag text not null,
            userName text not null,
            themeName text not null,
            styleProperty text not null,
            styleValue text not null,
            constraint PK_ElementStyles primary key (tag, userName, themeName, styleProperty, styleValue),
            constraint FK_Theme foreign key (userName, themeName) references Theme(userName, name),
            constraint FK_Style foreign key (styleProperty, styleValue) references Style(property, value)
        ) strict`);

        await connection.run(`create table if not exists Project (
            name text not null,
            userName text not null,
            themeName text not null,
            themeOwner text not null,
            constraint PK_Project primary key (name, userName),
            constraint FK_Theme foreign key (themeName, themeOwner) references Theme(name, userName)
        ) strict`);

        await connection.run(`create table if not exists File (
            projectName text not null,
            userName text not null,
            fileIndex integer not null,
            path text not null,
            constraint PK_File primary key (projectName, userName, fileIndex, path),
            constraint FK_Project foreign key (projectName, userName) references Project(name, userName)
        ) strict`);

    }

    private static async ensureTablesPopulated(connection: Database) : Promise<void> {
        const defTheme = await connection.get(`Select Count(*) as cnt from theme where name = '${Theme.DefaultName}' and userName = '${DB.SystemUserName}'`);
        const defUser = await connection.get(`Select Count(*) as cnt from User where name = '${DB.SystemUserName}'`);

        if(defTheme.cnt === 1 || defUser.cnt === 1) {
            return;
        }

        await DB.beginTransaction(connection);
        try {
            await connection.run(`Insert into User (name, password) VALUES ('${DB.SystemUserName}',',mxvc,mxvc,mvxc,mxvc,mxvc,m,mv,mxvc,mxcv,mxcvm,vc,mxcv,mxcv mvvm')`);
            await connection.run(`Insert into THEME (userName, name, isPublic)  Values ('${DB.SystemUserName}','${Theme.DefaultName}',1)`);
            await DB.commitTransaction(connection);
        }
        catch (error)
        {
            await DB.rollbackTransaction(connection);
        }


    }
}

