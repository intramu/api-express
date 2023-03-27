import range from "postgres-range";
import { withClient } from "./database";
import { TimeRange } from "../interfaces/IBracket";
import format from "pg-format";

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

function convertToTime(date: Date): string {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}
function hello() {
    const sql = "UPDATE bracket SET time_choices = $1 WHERE id = $2 ";
    const sql4 = "INSERT INTO test_bracket (time_choices) VALUES($1)";

    // const newest = timeArray.map((time) =>
    //     // eslint-disable-next-line no-bitwise
    //     range.serialize(new range.Range("12:00", "13:00", range.RANGE_LB_INC | range.RANGE_UB_INC))
    // );

    const date1 = new Date();
    const date2 = new Date();
    const date3 = new Date();
    const date4 = new Date();

    date1.setHours(8);
    date2.setHours(12);
    date3.setHours(14);
    date4.setHours(20);

    // original
    const test: TimeRange[] = [
        { startTime: date1, endTime: date2 },
        { startTime: date3, endTime: date4 },
    ];

    const org =
        "{['2021-10-01 06:12:12','2021-10-01 12:02:12'],['2021-10-01 14:12:12','2021-10-01 22:30:15']}";

    // const timeArray = `{[${new Date().()},${new Date().toISOString()}], [${new Date()},${new Date()}]}`;
    const sql2 = "SELECT * FROM bracket";
    const sql3 = "SELECT * FROM test_bracket LIMIT 1";

    const newTest =
        "{['2021-10-01 06:12:12','2021-10-01 12:02:12'],['2021-10-01 14:12:12','2021-10-01 22:30:15']}";
    const what = "{['10:12:12','12:02:12'],['18:30:30','22:30:15']}";

    // const newest = timeArray.substring(1, timeArray.length - 1).match(/[^,]+,[^,]+/g);
    // console.log(newest);

    return withClient(async (querier) => {
        const timeSlots = `{${test.map(
            (time) => `['${convertToTime(time.startTime)}','${convertToTime(time.endTime)}']`
        )}}`;

        console.log(timeSlots);

        // console.log(newTest);

        // const result = await querier(, [timeSlots.substring(0, timeSlots.length - 1), 2]);
        const result = await querier(sql, [timeSlots, 1]);

        console.log(result.rows);
    });

    // return withClient(async (querier) => {
    //     const [result] = (await querier(sql3)).rows;

    //     console.log(convertToTimeRanges(result.time_choices));
    // });
}

function convertToTimeRanges(timeRanges: string): TimeRange[] {
    if (!timeRanges) {
        return [];
    }

    const arrayReg = /[^,]+,[^,]+/g;

    const stripped = timeRanges.substring(1, timeRanges.length - 1).match(arrayReg);
    if (!stripped) {
        return [];
    }

    try {
        return stripped.map((time) => {
            const formattedTime = range.parse(time);
            if (!formattedTime.upper || !formattedTime.lower) {
                // logger.error("Time formatted incorrectly", { class: "Bracket" });
                throw new Error("Time formatted incorrectly");
            }
            const startTime = parseDate(formattedTime.lower);
            const endTime = parseDate(formattedTime.upper);

            return { startTime, endTime };
        });
    } catch (error) {
        console.log(error);

        return [];
    }
}

function parseDate(str: string): Date {
    const timeReg = /(\d+)[\.|:](\d+)[\.|:](\d+)/;

    const time = str.match(timeReg);
    if (!time) {
        // logger.error("Date in incorrect format", { class: "Bracket" });
        throw new Error("Date in incorrect format");
    }

    const date = new Date();
    date.setHours(Number(time[1]));
    date.setMinutes(Number(time[2]));
    date.setSeconds(Number(time[3]));

    return date;
}

// function parse("[1,5]")

// function parseBound(input, pos){
//     while()
// }

hello();
