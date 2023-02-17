export default class TournamentDAO {
    private readonly className = this.constructor.name;

    /**
     * Will create new tournament object in database without games
     * @param tournament - tournament object to be added to database
     * @returns - returns the tournament details or null
     */
    async createTournament(tournament: Tournament): Promise<Tournament | null> {
        logger.verbose("Entering method createTournament()", {
            class: this.className,
            values: tournament,
        });

        const sqlAdd =
            "INSERT INTO tournament (NAME, VISIBILITY, STATUS, NUMBER_OF_TEAMS, START_DATE, END_DATE, TOURNAMENT_TYPE, SPORT, organization_ID) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *";

        return withClient(async (querier) => {
            const response = await querier(sqlAdd, [
                tournament.getName(),
                tournament.getVisibility(),
                tournament.getStatus(),
                tournament.getNumberOfTeams(),
                tournament.getStartDate(),
                tournament.getEndDate(),
                tournament.getTournamentType(),
                tournament.getSport(),
                tournament.getOrganizationId(),
            ]);
            const [results] = response.rows;

            if (results === undefined) {
                return null;
            }

            return new Tournament({
                id: results.id,
                name: results.name,
                visibility: results.visibility,
                status: results.status,
                numberOfTeams: results.number_of_teams,
                dateCreated: results.date_created,
                startDate: results.start_date,
                endDate: results.end_date,
                tournamentType: results.tournament_type,
                sport: results.sport,
                games: [],
                organizationId: results.organization_id,
            });
        });
    }

    /**
     * Returns list of games in tournament
     * @param tournamentId - id to search by
     * @returns - Tournament details or null
     */
    async findTournamentByIdWithGames(tournamentId: number): Promise<Tournament | null> {
        logger.verbose("Entering method findTournamentId()", {
            class: this.className,
            values: tournamentId,
        });

        const sqlFind = "SELECT * FROM tournament WHERE id = $1";
        const sqlGames = "SELECT * FROM tournament_game WHERE tournament_id = $1";

        return withClient(async (querier) => {
            const responseTwo = await querier(sqlFind, [tournamentId]);
            const [tournament] = responseTwo.rows;

            if (tournament === undefined) {
                return null;
            }

            const responseOne = await querier(sqlGames, [tournamentId]);
            const resultsOne = responseOne.rows;

            if (resultsOne === undefined) {
                return null;
            }

            const gameList = resultsOne.map(
                (game) =>
                    new TournamentGame({
                        id: game.id,
                        dateCreated: game.date_created,
                        gameDate: game.game_date,
                        location: game.location,
                        locationDetails: game.location_details,
                        scoreHome: game.score_home,
                        scoreAway: game.score_away,
                        seedHome: game.seed_home,
                        seedAway: game.seed_away,
                        statusHome: game.status_home,
                        statusAway: game.status_away,
                        level: game.level,
                        round: game.round,
                        homeTeamId: game.home_team_id,
                        awayTeamId: game.away_team_id,
                        tournamentId: game.tournament_id,
                    })
            );

            return new Tournament({
                id: tournament.id,
                name: tournament.name,
                visibility: tournament.visibility,
                status: tournament.status,
                numberOfTeams: tournament.number_of_teams,
                dateCreated: tournament.date_created,
                startDate: tournament.start_date,
                endDate: tournament.end_date,
                tournamentType: tournament.tournament_type,
                sport: tournament.sport,
                games: gameList,
                organizationId: tournament.organization_id,
            });
        });
    }

    /**
     * Patches tournament details rather than completely updating object
     * @param tournament - tournament details to be changed
     * @returns - updated tournament details
     */
    async patchTournament(tournament: Tournament): Promise<Tournament | null> {
        logger.verbose("Entering method createTournamentGame()", {
            class: this.className,
            values: tournament,
        });

        const sqlPatch =
            "UPDATE tournament SET name=COALESCE($1, name), visibility=COALESCE($2, visibility), status=COALESCE($3, status), number_of_teams=COALESCE($4, number_of_teams), start_date=COALESCE($5, start_date), end_date=COALESCE($6, end_date), tournament_type=COALESCE($7, tournament_type), sport($8, sport) RETURNING *";

        const name = tournament.getName() || null;
        const sport = tournament.getSport() || null;

        return withClient(async (querier) => {
            const response = await querier(sqlPatch, [
                name,
                tournament.getVisibility(),
                tournament.getStatus(),
                tournament.getNumberOfTeams(),
                tournament.getStartDate(),
                tournament.getEndDate(),
                tournament.getTournamentType(),
                sport,
            ]);
            const [results] = response.rows;
            if (results === undefined) {
                return null;
            }

            return new Tournament({
                id: results.id,
                name: results.name,
                visibility: results.visibility,
                status: results.status,
                numberOfTeams: results.number_of_teams,
                dateCreated: results.date_created,
                startDate: results.start_date,
                endDate: results.end_date,
                tournamentType: results.tournament_type,
                sport: results.sport,
                games: [],
                organizationId: results.organization_id,
            });
        });
    }

    /**
     * Adds new tournament games to an existing tournament
     * @param games - list of games that will be created in tournament
     * @returns - returns list of the games just added
     */
    async createTournamentGames(games: TournamentGame[]): Promise<TournamentGame[]> {
        logger.verbose("Entering method createTournamentGames()", {
            class: this.className,
            values: games,
        });

        const sqlAdd =
            "INSERT INTO tournament_game (GAME_DATE, LOCATION, LOCATION_DETAILS, SCORE_HOME, SCORE_AWAY, SEED_HOME, SEED_AWAY, STATUS_HOME, STATUS_AWAY, LEVEL, ROUND, HOME_TEAM_ID, AWAY_TEAM_ID, tournament_ID) VALUES %L RETURNING *";

        const values = games.map((game) => [
            game.getGameDate(),
            game.getLocation(),
            game.getLocationDetails(),
            game.getScoreHome(),
            game.getScoreAway(),
            game.getSeedHome(),
            game.getSeedAway(),
            game.getStatusHome(),
            game.getStatusAway(),
            game.getLevel(),
            game.getRound(),
            game.getHomeTeamId(),
            game.getAwayTeamId(),
            game.getTournamentId(),
        ]);

        return withClient(async (querier) => {
            const response = await querier(format(sqlAdd, values));
            const results = response.rows;
            console.log(results);

            if (results === undefined) {
                return [];
            }

            return results.map(
                (game) =>
                    new TournamentGame({
                        id: game.id,
                        dateCreated: game.date_created,
                        gameDate: game.game_date,
                        location: game.location,
                        locationDetails: game.location_details,
                        scoreHome: game.score_home,
                        scoreAway: game.score_away,
                        seedHome: game.seed_home,
                        seedAway: game.seed_away,
                        statusHome: game.status_home,
                        statusAway: game.status_away,
                        level: game.level,
                        round: game.round,
                        homeTeamId: game.home_team_id,
                        awayTeamId: game.away_team_id,
                        tournamentId: game.tournament_id,
                    })
            );
        });
    }
}
