import { Pool, PoolClient, QueryConfig, QueryResult, QueryResultRow } from "pg";
import logger from "../utilities/winstonConfig";

export const db = new Pool({
    user: "noah",
    host: "localhost",
    database: "intramu",
    password: "root",
    port: 5432,
    max: 20,
});

export type IsRollback = typeof IsRollback;
export const IsRollback = Symbol("IsRollback");

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

type Querier = <T extends QueryResultRow>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryTextOrConfig: string | QueryConfig<any[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values?: any[] | undefined
) => Promise<QueryResult<T>>;

export async function rollback(client: PoolClient): Promise<void> {
    await client.query("ROLLBACK");
}

export async function withClient<T>(
    runner: (querier: Querier, client: PoolClient) => T
): Promise<T> {
    const client = await getClient();
    const result = await runner(createQuerier(client), client);
    client.release();
    return result;
}

/**
 * If you return in the runner with IsRollback or throw an exception, the transaction will be rolled back.
 * @param runner
 * @returns
 */
export async function withClientRollback<T>(
    runner: (querier: Querier, client: PoolClient) => Promise<T | typeof IsRollback>
): Promise<T | IsRollback> {
    return withClient(async (_, client) =>
        rollbackWithErrors(client, (querier) => runner(querier, client))
    );
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

export function createQuerier(client: PoolClient): <T extends QueryResultRow>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryTextOrConfig: string | QueryConfig<any[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values?: any[] | undefined
) => Promise<QueryResult<T>> {
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

/**
 * If you return in the runner with IsRollback or throw an exception, the transaction will be rolled back.
 * @param client
 * @param runner
 * @returns
 */
export async function rollbackWithErrors<T>(
    client: PoolClient,
    runner: (querier: Querier, client: PoolClient) => Promise<T | typeof IsRollback>
): Promise<T | typeof IsRollback> {
    const querier = createQuerier(client);

    try {
        await querier("BEGIN");
        const result = await runner(querier, client);
        if (result === IsRollback) {
            await rollback(client);
        } else {
            await querier("COMMIT");
        }
        return result;
    } catch (error) {
        logger.error("Database Query Error with rollback", {
            type: error,
        });
        await rollback(client);
        throw error;
    }
}
