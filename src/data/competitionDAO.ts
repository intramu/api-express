import format from "pg-format";
import { BracketDatabaseInterface } from "../interfaces/Bracket";
import { ContestDatabaseInterface } from "../interfaces/Contest";
import { LeagueDatabaseInterface } from "../interfaces/League";
import { Bracket } from "../models/competition/Bracket";
import { Contest } from "../models/competition/Contest";
import { Division } from "../models/competition/Division";
import { League } from "../models/competition/League";
import { TimeSlot } from "../models/competition/TimeSlot";
import { Tournament } from "../models/competition/Tournament";
import { TournamentGame } from "../models/competition/TournamentGame";
import { Team } from "../models/Team";
import { TournamentGameStatus } from "../utilities/enums/competitionEnum";
import logger from "../utilities/winstonConfig";
import { IsRollback, withClient, withClientRollback } from "./database";

export default class CompetitionDAO {
    private readonly className = this.constructor.name;

    // todo: async patchBracket(bracket: Bracket): Promise<Bracket[] | null>{    }
}

const test = new CompetitionDAO();
// const list: TournamentGame[] = [
//     new TournamentGame({
//         id: null,
//         dateCreated: null,
//         gameDate: null,
//         location: "GCU",
//         locationDetails: "",
//         scoreHome: 0,
//         scoreAway: 0,
//         seedHome: 1,
//         seedAway: 2,
//         statusHome: TournamentStatus.NOTPLAYED,
//         statusAway: TournamentStatus.NOTPLAYED,
//         level: 1,
//         round: 1,
//         homeTeamId: 4,
//         awayTeamId: 10,
//         tournamentId: 2,
//     }),
//     new TournamentGame({
//         id: null,
//         dateCreated: null,
//         gameDate: null,
//         location: "GCU",
//         locationDetails: "",
//         scoreHome: 0,
//         scoreAway: 0,
//         seedHome: 1,
//         seedAway: 2,
//         statusHome: TournamentStatus.NOTPLAYED,
//         statusAway: TournamentStatus.NOTPLAYED,
//         level: 1,
//         round: 2,
//         homeTeamId: 4,
//         awayTeamId: 10,
//         tournamentId: 2,
//     }),
// ];

testFunc();

async function testFunc() {
    // await test.findPathByBracketId(1);
    // await test.findLeaguesAndChildren(1);
    // console.log(await test.findTournamentByIdWithGames(2));
    // await test.createTournamentGames();
    // await test.createTournament(
    //     new Tournament({
    //         id: null,
    //         name: "My Tourney",
    //         visibility: Visibility.CLOSED,
    //         status: Status.ACTIVE,
    //         numberOfTeams: 2,
    //         dateCreated: null,
    //         startDate: new Date(),
    //         endDate: new Date(),
    //         tournamentType: TournamentType.RANDOM,
    //         sport: "soccer",
    //         games: [],
    //         organizationId: "03503875-f4a2-49f6-bb9f-e9a22fb852d4",
    //     })
    // );
    // await test.createTournamentGames(list);
}
