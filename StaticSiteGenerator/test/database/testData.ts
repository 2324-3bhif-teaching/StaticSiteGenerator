import {DB} from "../../src/database/data";
import {Database} from "sqlite";

const testDBPath: string = "test/database/test.db";

export async function setupTestData() : Promise<void> {
    DB.dbFilePath = testDBPath;
    let connection: Database | undefined;
    try {
        connection = await DB.createDBConnection();
        await DB.ensureTablesCleared(connection);
    }
    catch (error)
    {
        if (connection) {
            await DB.rollbackTransaction(connection);
        }
    }
    finally {
        if (connection) {
            await connection.close();
        }
    }
}