import { CompetitionStatus, ContestGameStatus } from "../../utilities/enums/competitionEnum";
import { Location } from "../Location";
import { Team } from "../Team";

interface ContestGameProps {
    id: number;
    dateCreated: Date | null;
    gameDate: Date | null;
    notes: string;
    scoreHome: number | null;
    scoreAway: number | null;
    statusHome: ContestGameStatus | null;
    statusAway: ContestGameStatus | null;
    location: Location;
    homeTeam: Team;
    awayTeam: Team;
}
export class ContestGame {
    protected id;

    protected dateCreated;

    protected gameDate;

    protected notes;

    protected scoreHome;

    protected scoreAway;

    protected statusHome;

    protected statusAway;

    protected location;

    protected homeTeam;

    protected awayTeam;

    // protected bracketId:

    constructor(props: Partial<ContestGameProps>) {
        const {
            id = 0,
            dateCreated = null,
            gameDate = null,
            notes = "",
            scoreHome = null,
            scoreAway = null,
            statusHome = ContestGameStatus.NULL,
            statusAway = ContestGameStatus.NULL,
            location = new Location({}),
            homeTeam = new Team({}),
            awayTeam = new Team({}),
        } = props;

        this.id = id;
        this.dateCreated = dateCreated;
        this.gameDate = gameDate;
        this.notes = notes;
        this.scoreHome = scoreHome;
        this.scoreAway = scoreAway;
        this.statusHome = statusHome;
        this.statusAway = statusAway;
        this.location = location;
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
    }

    public static fromDatabase(props: {
        id: number;
        date_created: Date;
        game_date: Date | null;
        notes: string;
        score_home: number | null;
        score_away: number | null;
        status_home: number;
        status_away: number;
        location: Location;
        home_team: Team;
        away_team: Team;
    }) {
        const obj = new ContestGame(props);
        obj.dateCreated = props.date_created;
        obj.gameDate = props.game_date;
        obj.scoreHome = props.score_home;
        obj.scoreAway = props.score_away;
        obj.statusHome = props.status_home;
        obj.statusAway = props.status_away;
        obj.homeTeam = props.home_team;
        obj.awayTeam = props.away_team;

        return obj;
    }

    getId(): number {
        return this.id;
    }
    setId(id: number) {
        this.id = id;
    }

    getDateCreated(): Date | null {
        return this.dateCreated;
    }
    setDateCreated(dateCreated: Date) {
        this.dateCreated = dateCreated;
    }

    getGameDate(): Date | null {
        return this.gameDate;
    }
    setGameDate(gameDate: Date) {
        this.gameDate = gameDate;
    }

    getNotes(): string {
        return this.notes;
    }
    setNotes(notes: string) {
        this.notes = notes;
    }

    getScoreHome(): number | null {
        return this.scoreHome;
    }
    setScoreHome(scoreHome: number) {
        this.scoreHome = scoreHome;
    }

    getScoreAway(): number | null {
        return this.scoreAway;
    }
    setScoreAway(scoreAway: number) {
        this.scoreAway = scoreAway;
    }

    getStatusHome(): ContestGameStatus | null {
        return this.statusHome;
    }
    setStatusHome(statusHome: ContestGameStatus | null) {
        this.statusHome = statusHome;
    }

    getStatusAway(): ContestGameStatus | null {
        return this.statusAway;
    }
    setStatusAway(statusAway: ContestGameStatus | null) {
        this.statusAway = statusAway;
    }

    getLocation(): Location {
        return this.location;
    }
    setLocation(location: Location) {
        this.location = location;
    }

    getHomeTeam(): Team {
        return this.homeTeam;
    }
    setHomeTeam(homeTeam: Team) {
        this.homeTeam = homeTeam;
    }

    getAwayTeam(): Team {
        return this.awayTeam;
    }
    setAwayTeam(awayTeam: Team) {
        this.awayTeam = awayTeam;
    }
}
