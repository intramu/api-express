import { TournamentStatus } from "../../utilities/enums";

export class TournamentGame {
    protected id;

    protected dateCreated;

    protected gameDate;

    protected location;

    protected locationDetails;

    protected scoreHome;

    protected scoreAway;

    protected seedHome;

    protected seedAway;

    protected statusHome;

    protected statusAway;

    protected level;

    protected round;

    protected homeTeamId;

    protected awayTeamId;

    protected tournamentId;

    constructor(props: {
        id: number | null;
        dateCreated: Date | null;
        gameDate: Date | null;
        location: string;
        locationDetails: string;
        scoreHome: number;
        scoreAway: number;
        seedHome: number;
        seedAway: number;
        statusHome: TournamentStatus;
        statusAway: TournamentStatus;
        level: number;
        round: number;
        homeTeamId: number | null;
        awayTeamId: number | null;
        tournamentId: number;
    }) {
        this.id = props.id;
        this.dateCreated = props.dateCreated;
        this.gameDate = props.gameDate;
        this.location = props.location;
        this.locationDetails = props.locationDetails;
        this.scoreHome = props.scoreHome;
        this.scoreAway = props.scoreAway;
        this.seedHome = props.seedHome;
        this.seedAway = props.seedAway;
        this.statusHome = props.statusHome;
        this.statusAway = props.statusAway;
        this.level = props.level;
        this.round = props.round;
        this.homeTeamId = props.homeTeamId;
        this.awayTeamId = props.awayTeamId;
        this.tournamentId = props.tournamentId;
    }

    getGameDate(): Date | null {
        return this.gameDate;
    }

    getLocation(): string {
        return this.location;
    }

    getLocationDetails(): string {
        return this.locationDetails;
    }

    getScoreHome(): number {
        return this.scoreHome;
    }

    getScoreAway(): number {
        return this.scoreAway;
    }

    getSeedHome(): number {
        return this.seedHome;
    }

    getSeedAway(): number {
        return this.seedAway;
    }

    getStatusHome(): TournamentStatus {
        return this.statusHome;
    }

    getStatusAway(): TournamentStatus {
        return this.statusAway;
    }

    getLevel(): number {
        return this.level;
    }

    getRound(): number {
        return this.round;
    }

    getHomeTeamId(): number | null {
        return this.homeTeamId;
    }

    getAwayTeamId(): number | null {
        return this.awayTeamId;
    }

    getTournamentId(): number {
        return this.tournamentId;
    }
}
