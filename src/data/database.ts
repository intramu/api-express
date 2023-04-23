import { Pool, PoolClient, QueryConfig, QueryResult, QueryResultRow } from "pg";
import logger from "../utilities/winstonConfig";

// creates connection pool
export const db = new Pool({
    user: "noah",
    host: "localhost",
    database: "intramu",
    password: "root",
    port: 5432,
    max: 20,
});

// rollback type if error occurs
export type IsRollback = typeof IsRollback;
export const IsRollback = Symbol("IsRollback");

/**
 * Gets connection from pool and
 * @returns - connection or null if connection error occurred
 */
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

// generic that allows user to pass in return type of data from database
type Querier = <T extends QueryResultRow>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryTextOrConfig: string | QueryConfig<any[]>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values?: any[] | undefined
) => Promise<QueryResult<T>>;

/**
 * Will rollback query when called
 * @param client - client connection
 */
export async function rollback(client: PoolClient): Promise<void> {
    await client.query("ROLLBACK");
}

/**
 * Get connection, makes query, then releases connection
 * @returns - object that is type of generic
 */
export async function withClient<T>(
    runner: (querier: Querier, client: PoolClient) => T
): Promise<T> {
    const client = await getClient();
    const result = await runner(createQuerier(client), client);
    client.release();
    return result;
}

/**
 * Extended functionality of withClient that will rollback query if specified
 * @returns - object that is type of generic or IsRollback
 */
export async function withClientRollback<T>(
    runner: (querier: Querier, client: PoolClient) => Promise<T | typeof IsRollback>
): Promise<T | IsRollback> {
    return withClient(async (_, client) =>
        rollbackWithErrors(client, (querier) => runner(querier, client))
    );
}

/**
 * Simply queries database and returns result
 * @param client - client connection
 * @param queryTextOrConfig - sql statement to be executed
 * @param values - parameters to be passed to query
 * @returns - promise of result that is of generic type
 */
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

/**
 * Wrapper for querier function that is returned for user.
 * Gets sql statement and parameters that are passed to query
 * @param client - connection
 * @returns - querier function for user
 */
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
 * Runner function to manage transaction for query
 * @param client - connection
 * @returns - result of query
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
