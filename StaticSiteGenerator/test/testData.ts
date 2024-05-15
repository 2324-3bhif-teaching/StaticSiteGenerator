import {DB} from "../src/database/data";
import {Database} from "sqlite";

const testDBPath: string = "test/test.db";

export async function setupTestData() : Promise<void> {
    DB.dbFilePath = testDBPath;
    const connection: Database = await DB.createDBConnection();
    await DB.beginTransaction(connection);
    try {
        await DB.commitTransaction(connection);
    }
    catch (error)
    {
        await DB.rollbackTransaction(connection);
    }
    finally {
        await connection.close();
    }
}