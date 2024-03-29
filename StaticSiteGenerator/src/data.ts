import { Database as Driver } from "sqlite3";
import { open, Database } from "sqlite";

export const dbFileName = 'StaticSiteGenerator.db';

export class DB {
    public static async createDBConnection(): Promise<Database> {
        const db = await open({
            filename: `./${dbFileName}`,
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

        await connection.run(`create table if not exists User (
            name text not null,
            password text not null,
            constraint PK_User primary key (name)
        ) strict`);

        await connection.run(`create table if not exists Theme (
            userName text not null,
            name text not null,
            isPublic integer not null,
            constraint PK_Theme primary key (name),
            constraint PK_Theme primary key (userName),
            constraint FK_User foreign key (userName) reference User(name)
        ) strict`);

        await connection.run(`create table if not exists Style(
            property text not null,
            value text not null,
            constraint PK_Style primary key (property),
            constraint PK_Style primary key (value)
        ) strict`);

        await connection.run(`create table if not exists ElementStyles (
            tag text not null,
            userName text not null,
            themeName text not null,
            styleProperty text not null,
            styleValue text not null,
            constraint PK_ElementStyles primary key (tag),
            constraint PK_ElementStyles primary key (userName ),
            constraint PK_ElementStyles primary key (themeName ),
            constraint PK_ElementStyles primary key (styleProperty),
            constraint PK_ElementStyles primary key (styleValue),
            constraint FK_Theme foreign key (userName) reference Theme(userName),
            constraint FK_Theme foreign key (themeName) reference Theme(name),
            constraint FK_Style foreign key (styleProperty) reference Style(property),
            constraint FK_Style foreign key (styleValue) reference Style(value)
        ) strict`);

        await connection.run(`create table if not exists Project (
            name text not null,
            userName text not null,
            themeName text not null,
            themeOwner text not null,
            constraint PK_Project primary key (name),
            constraint PK_Project primary key (userName),
            constraint FK_Theme foreign key (themeName) reference Theme(name),
            constraint FK_Theme foreign key (themeOwner) reference Theme(userName)
        ) strict`);

        await connection.run(`create table if not exists File (
            projectName text not null,
            userName text not null,
            index integer not null,
            path text not null,
            constraint PK_File primary key (projectName),
            constraint PK_File primary key (userName),
            constraint PK_File primary key (index),
            constraint PK_File primary key (path),
            contraint FK_Project foreign key (projectName) reference Project(name),
            contraint FK_Project foreign key (userName) reference Project(userName)
        ) strict`);

    }
}

