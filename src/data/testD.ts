import range from "postgres-range";
import { withClient } from "./database";

interface test {
    id: number;
    time_choices: string;
}

class NewTest {
    id: number;

    timeChoices: Date[][];

    constructor(id: number, timeChoices: Date[][]) {
        this.id = id;
        this.timeChoices = timeChoices;
    }
}

const here = new NewTest(1, [
    [new Date(), new Date()],
    [new Date(), new Date()],
]);

function hello() {
    const sql = "INSERT INTO test_bracket_two (TIME_CHOICES) VALUES($1)";

    // const newest = timeArray.map((time) =>
    //     // eslint-disable-next-line no-bitwise
    //     range.serialize(new range.Range("12:00", "13:00", range.RANGE_LB_INC | range.RANGE_UB_INC))
    // );

    // original
    const org =
        "{['2021-10-01 06:00:00','2021-10-01 10:00:00'],['2021-10-01 14:00:00','2021-10-01 20:00:00']}";

    // const timeArray = `{[${new Date().()},${new Date().toISOString()}], [${new Date()},${new Date()}]}`;
    const sql2 = "SELECT * FROM bracket";
    const sql3 = "SELECT time_choices FROM test_bracket";

    // const newest = timeArray.substring(1, timeArray.length - 1).match(/[^,]+,[^,]+/g);
    // console.log(newest);

    return withClient(async (querier) => {
        const result = await querier(sql, [org]);

        console.log(result.rows);
    });

    // return withClient(async (querier) => {
    //     const result1 = (await querier<test>(sql3)).rows;

    //     result1.forEach((r) => {
    //         console.log(r.time_choices);

    //         const t = r.time_choices.substring(1, r.time_choices.length - 1).match(/[^,]+,[^,]+/g);
    //         console.log(t);

    //         console.log(range.parse(t[1]));
    //     });

    //     // console.log(range.parse(finished[0]));
    // });
}

// function parse("[1,5]")

// function parseBound(input, pos){
//     while()
// }

hello();
