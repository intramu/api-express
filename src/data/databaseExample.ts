import { IsRollback, withClientRollback } from "./database";

interface A {
    a: string;
    b: number;
    c: string[];
}

interface ADatabaseResponse {
    a: string;
    b: string;
    c: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function exampleRollback(): Promise<A | null> {
    const result = await withClientRollback<A>(async (querier) => {
        const response = await querier<ADatabaseResponse>("SELECT * FROM table");
        const results = response.rows;
        if (results.length === 0) {
            return IsRollback;
        }
        await querier("INSERT INTO table VALUES ($1, $2, $3)", [1, 2, 3]);
        if (Math.random() < 0.5) {
            throw new Error("Random error");
        }

        const [firstRow] = results;
        return {
            a: firstRow.a,
            b: parseInt(firstRow.b, 10),
            c: firstRow.c.split(","),
        };
    });

    if (result === IsRollback) {
        return null;
    }
    return result;
}
