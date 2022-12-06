import { Pool, PoolClient, QueryConfig, QueryResult, QueryResultRow } from "pg";
import logger from "../utilities/winstonConfig";

export const db = new Pool({
    user: "noahr",
    host: "localhost",
    database: "noahr",
    password: "root",
    port: 5432,
    max: 20,
});

export async function getClient(): Promise<PoolClient> {
    try {
        return await db.connect();
    } catch (error) {
        logger.error("Database Connection Error", {
            type: error,
        });
        throw error;
    }
}

type Querier<T extends QueryResultRow> = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryTextOrConfig: string | QueryConfig<any[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values?: any[] | undefined
) => Promise<QueryResult<T>>;

export async function useClient<T, U extends QueryResultRow>(
    runner: (querier: Querier<U>, client: PoolClient) => T
): Promise<T> {
    const client = await getClient();
    const result = await runner(createQuerier(client), client);
    client.release();
    return result;
}

export async function query<T extends QueryResultRow>(
    client: PoolClient,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryTextOrConfig: string | QueryConfig<any[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values?: any[] | undefined
): Promise<QueryResult<T>> {
    try {
        return await client.query<T>(queryTextOrConfig, values);
    } catch (error) {
        logger.error("Database Query Error", {
            type: error,
            query: queryTextOrConfig,
            values,
        });
        throw error;
    }
}

export function createQuerier(client: PoolClient) {
    async function querier<T extends QueryResultRow>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryTextOrConfig: string | QueryConfig<any[]>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        values?: any[] | undefined
    ): Promise<QueryResult<T>> {
        return query(client, queryTextOrConfig, values);
    }

    return querier;
}

export async function rollbackWithErrors<T>(
    client: PoolClient,
    runner: <U extends QueryResultRow>(
        querier: Querier<U>,
        rollback: () => Promise<void>,
        client: PoolClient
    ) => Promise<T | undefined>
): Promise<T | undefined> {
    let ranRollback = false;
    async function runRollback() {
        ranRollback = true;
        await query(client, "ROLLBACK");
    }

    const querier = createQuerier(client);

    let result: T | undefined;

    try {
        await querier("BEGIN");
        result = await runner(querier, runRollback, client);
        if (!ranRollback) {
            await querier("COMMIT");
            return result;
        }
    } catch (error) {
        logger.error("Database Query Error with rollback", {
            type: error,
        });
        await runRollback();
        throw error;
    }

    return undefined;
}
