export default class ContestDAO {
    private readonly className = this.constructor.name;

    /**
     * Creates new contest to setup league play
     * @param contest - contest details to be added to database
     * @returns - returns contest details or null
     */
    async createContest(contest: Contest): Promise<Contest | null> {
        logger.verbose("Entering method createContest()", {
            class: this.className,
            values: contest,
        });

        const sqlAdd =
            "INSERT INTO contest (NAME, VISIBILITY, STATUS, START_DATE, END_DATE, PLAYOFF, PLAYOFF_TYPE, PLAYOFF_SEEDING_TYPE, CONTEST_TYPE, organization_Id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";

        return withClient(async (querier) => {
            const [result] = (
                await querier(sqlAdd, [
                    contest.getName(),
                    contest.getVisibility(),
                    contest.getStatus(),
                    contest.getStartDate(),
                    contest.getEndDate(),
                    contest.getPlayoff(),
                    contest.getPlayoffType(),
                    contest.getPlayoffSeedingType(),
                    contest.getContestType(),
                    contest.getOrganizationId(),
                ])
            ).rows;

            if (contest === undefined) {
                return null;
            }

            return new Contest({
                id: result.id,
                name: result.name,
                visibility: result.visibility,
                status: result.status,
                dateCreated: result.date_created,
                startDate: result.start_date,
                endDate: result.end_date,
                playoff: result.playoff,
                playoffType: result.playoff_type,
                playoffSeedingType: result.playoff_seeding_type,
                contestType: result.contest_type,
                leagues: [],
                organizationId: result.organization_id,
            });
        });
    }

    /**
     * Creates new leagues without divisions or brackets. Probably not needed
     * @param leagues - list of leagues to be created
     * @returns - returns list of leagues just created
     */
    async createLeagues(leagues: League[]): Promise<League[]> {
        logger.verbose("Entering method createLeagues()", {
            class: this.className,
            values: leagues,
        });

        const sqlAdd =
            "INSERT INTO league (NAME, SPORT, START_DATE, END_DATE, contest_ID, organization_ID) VALUES %L RETURNING *";

        const values = leagues.map((league) => [
            league.getName(),
            league.getSport(),
            league.getStartDate(),
            league.getEndDate(),
            league.getContestId(),
            league.getOrganizationId(),
        ]);

        return withClient(async (querier) => {
            const results = (await querier(format(sqlAdd, values))).rows;

            if (results.length === 0) {
                return [];
            }

            return results.map(
                (league) =>
                    new League({
                        id: league.id,
                        name: league.name,
                        sport: league.sport,
                        startDate: league.start_date,
                        endDate: league.end_date,
                        divisions: [],
                        contestId: league.contest_id,
                        organizationId: league.organization_id,
                    })
            );
        });
    }

    /**
     * Due to the nested nature of this data, there will many queries on the database
     * A single connection is used to enter all data into the database, preventing
     * the need to drop and acquire connections for every object
     * @param leagues - list of leagues with divisions and brackets
     * @param orgId - organization to create leagues under, ? may not be needed in future
     * @param contestId - contest to put leagues under
     * @returns - returns true or false for success and failure
     */
    async createLeaguesAndChildren(
        leagues: League[],
        orgId: string,
        contestId: number
    ): Promise<boolean> {
        logger.verbose("Entering method createFullLeagues()", {
            class: this.className,
            values: leagues,
        });

        const sqlLeague =
            "INSERT INTO league (NAME, SPORT, START_DATE, END_DATE, contest_ID, organization_ID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

        const sqlDivision =
            "INSERT INTO division (NAME, TYPE, LEVEL, MAX_TEAM_SIZE, MIN_WOMEN_COUNT, MIN_MEN_COUNT, league_ID) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";

        const sqlBracket =
            "INSERT INTO bracket (DAY_CHOICES, MAX_TEAM_AMOUNT, division_ID) VALUES ($1, $2, $3) RETURNING *";

        const sqlTimeSlot =
            "INSERT INTO bracket_time_slots (START_TIME, END_TIME, bracket_ID) VALUES ($1, $2, $3) RETURNING *";

        // const leagueValues: any = [];
        // const divisionValues: any = [];
        // const bracketValues: any = [];
        // const timeSlotValues: any = [];

        // leagues.forEach((league) => {
        //     leagueValues.push([
        //         league.getName(),
        //         league.getSport(),
        //         league.getStartDate(),
        //         league.getEndDate(),
        //         league.getContestId(),
        //         league.getOrganizationId(),
        //     ]);

        // league.getDivisions().forEach((division) => {
        //     divisionValues.push([
        //         division.getName(),
        //         division.getType(),
        //         division.getLevel(),
        //         division.getMaxTeamSize(),
        //         division.getMinWomenCount(),
        //         division.getMinMenCount(),
        //         division.getLeagueId(),
        //     ]);

        //     division.getBrackets().forEach((bracket) => {
        //         bracketValues.push([
        //             bracket.getDayChoices(),
        //             bracket.getMaxSize(),
        //             bracket.getDivisionId(),
        //         ]);

        //         bracket.getTimeSlots().forEach((timeSlot) => {
        //             timeSlotValues.push([
        //                 timeSlot.getStartTime(),
        //                 timeSlot.getEndTime(),
        //                 timeSlot.getBracketId(),
        //             ]);
        //         });
        //     });
        // });
        // });

        const result = await withClientRollback(async (querier) => {
            // i'm not feeling this. It causes a lot of query operations on the database
            // won't be run that often. Creating leagues only happens twice a semester at
            // GCU at least. Fetching this list on the other hand may be slow. We will see

            // foreach league we enter in the details then use the returned id to enter
            // in divisions. This pattern continues all the way down the tree to the
            // timeslots for brackets
            leagues.forEach(async (league) => {
                const [returnedLeague] = (
                    await querier(sqlLeague, [
                        league.getName(),
                        league.getSport(),
                        league.getStartDate(),
                        league.getEndDate(),
                        contestId,
                        orgId,
                    ])
                ).rows;

                if (returnedLeague === undefined) {
                    return IsRollback;
                }

                return league.getDivisions().forEach(async (division) => {
                    const [returnedDivision] = (
                        await querier(sqlDivision, [
                            division.getName(),
                            division.getType(),
                            division.getLevel(),
                            division.getMaxTeamSize(),
                            division.getMinWomenCount(),
                            division.getMinMenCount(),
                            returnedLeague.id,
                        ])
                    ).rows;

                    if (returnedDivision === undefined) {
                        return IsRollback;
                    }

                    return division.getBrackets().forEach(async (bracket) => {
                        const [returnedBracket] = (
                            await querier(sqlBracket, [
                                bracket.getDayChoices(),
                                bracket.getMaxTeamAmount(),
                                returnedDivision.id,
                            ])
                        ).rows;

                        if (returnedBracket === undefined) {
                            return IsRollback;
                        }

                        return bracket.getTimeSlots().forEach(async (timeSlot) => {
                            const [returnedTimeSlot] = (
                                await querier(sqlTimeSlot, [
                                    timeSlot.getStartTime(),
                                    timeSlot.getEndTime(),
                                    returnedBracket.id,
                                ])
                            ).rows;

                            if (returnedTimeSlot === undefined) {
                                return IsRollback;
                            }

                            return returnedTimeSlot;
                        });
                    });
                });
            });

            return true;
        });

        if (result === IsRollback) {
            return false;
        }

        return result;
    }

    /**
     * Finds all leagues under a contest along with its children
     * @param contestId - id to fetch leagues with
     * @returns - returns list of leagues, division, and brackets
     */
    async findLeaguesAndChildrenByContestId(contestId: number): Promise<League[]> {
        logger.verbose("Entering method findLeaguesAndChildrenByContestId()", {
            class: this.className,
            values: contestId,
        });

        const sqlLeague = "SELECT * FROM league WHERE contest_id = $1";
        const sqlDivision = "SELECT * FROM division WHERE league_id IN (%L)";
        const sqlBracket = "SELECT * FROM bracket WHERE division_id IN (%L)";
        const sqlTimeSlot = "SELECT * FROM bracket_time_slots WHERE bracket_id IN (%L)";
        const sqlTeams = "SELECT * FROM team WHERE bracket_id IN (%L)";

        // set of queries creates lists of leagues, divisions, and brackets that are unsorted
        const result = await withClientRollback(async (querier) => {
            const leagues = (await querier<LeagueDatabaseInterface>(sqlLeague, [contestId])).rows;

            // fetch divisions based on league ids
            const leagueIdList = leagues.map((x) => x.id);
            const divisions = (await querier(format(sqlDivision, leagueIdList))).rows;

            // fetch brackets based on division ids
            const divisionIdList = divisions.map((x) => x.id);
            const brackets = (await querier(format(sqlBracket, divisionIdList))).rows;

            // fetch timeSlots based on bracket ids
            const bracketIdList = brackets.map((x) => x.id);
            const timeSlots = (await querier(format(sqlTimeSlot, bracketIdList))).rows;

            // fetch all Teams that are part of bracket
            const teams = (await querier(format(sqlTeams, bracketIdList))).rows;

            if (leagues.length === 0) {
                return IsRollback;
            }

            /** My thought process here was to reverse the process for the insert function
             * above. The insert relies on querying the database for every single league, division,
             * bracket, etc. With this method it only queries once for each object, then
             * relies on server power to sort the results into objects. This retrieve
             * function is going to be used a lot, so we will keep an eye on its performance
             */
            const formattedLeagues = leagues.map((league) => {
                const divisionList = divisions
                    // every division is sorted out first by checking if the foreign key
                    // on the division matches the league id
                    // this pattern continues for the other objects
                    .filter((division) => division.league_id === league.id)
                    .map((division) => {
                        const bracketList = brackets
                            .filter((bracket) => bracket.division_id === division.id)
                            .map((bracket) => {
                                const timeSlotList = timeSlots
                                    .filter((timeSlot) => timeSlot.bracket_id === bracket.id)
                                    .map(
                                        (timeSlot) =>
                                            new TimeSlot({
                                                id: timeSlot.id,
                                                startTime: timeSlot.start_time,
                                                endTime: timeSlot.end_time,
                                                bracketId: timeSlot.bracket_id,
                                            })
                                    );
                                const teamList = teams
                                    .filter((team) => team.bracket_id === bracket.id)
                                    .map(
                                        (team) =>
                                            new Team({
                                                id: team.id,
                                                name: team.name,
                                                wins: team.wins,
                                                ties: team.ties,
                                                losses: team.losses,
                                                image: team.image,
                                                visibility: team.visibility,
                                                sport: team.sport,
                                                dateCreated: team.date_created,
                                                sportsmanshipScore: team.sportsmanship_score,
                                                status: team.status,
                                                maxTeamSize: team.max_team_size,
                                                players: [],
                                                organizationId: team.organization_id,
                                                bracketId: null,
                                            })
                                    );

                                return new Bracket({
                                    id: bracket.id,
                                    dayChoices: bracket.day_choices,
                                    timeSlots: timeSlotList,
                                    maxTeamAmount: bracket.max_team_amount,
                                    teams: teamList,
                                    divisionId: bracket.division_id,
                                });
                            });

                        return new Division({
                            id: division.id,
                            name: division.name,
                            type: division.type,
                            level: division.level,
                            maxTeamSize: division.max_team_size,
                            minMenCount: division.min_men_count,
                            minWomenCount: division.min_women_count,
                            brackets: bracketList,
                            leagueId: division.league_id,
                        });
                    });

                return new League({
                    id: league.id,
                    name: league.name,
                    sport: league.sport,
                    startDate: league.start_date,
                    endDate: league.end_date,
                    divisions: divisionList,
                    contestId: league.contest_id,
                    organizationId: league.organization_id,
                });
            });

            return formattedLeagues;
        });

        if (result === IsRollback) {
            return [];
        }
        return result;
    }

    /**
     * Returns contest details by using the id
     * @param contestId - id to search for contest
     * @returns - contest object or null
     */
    async findContestById(contestId: number): Promise<Contest | null> {
        logger.verbose("Entering method findContest()", {
            class: this.className,
            values: contestId,
        });

        const sqlFind = "SELECT * FROM contest WHERE id = $1";
        return withClient(async (querier) => {
            const [contest] = (await querier<ContestDatabaseInterface>(sqlFind, [contestId])).rows;

            if (contest === undefined) {
                return null;
            }

            return new Contest({
                id: contest.id,
                name: contest.name,
                visibility: contest.visibility,
                status: contest.status,
                dateCreated: contest.date_created,
                startDate: contest.start_date,
                endDate: contest.end_date,
                playoff: contest.playoff,
                playoffType: contest.playoff_type,
                playoffSeedingType: contest.playoff_seeding_type,
                contestType: contest.contest_type,
                leagues: [],
                organizationId: contest.organization_id,
            });
        });
    }

    /**
     * Returns bracket object along with timeslots
     * @param bracketId - id to search for bracket with
     * @returns - Bracket object or null
     */
    async findBracketById(bracketId: number): Promise<Bracket | null> {
        logger.verbose("Entering method findBracketById()", {
            class: this.className,
            values: bracketId,
        });

        const sqlBracket = "SELECT * FROM bracket WHERE id = $1";
        const sqlTime = "SELECT * FROM bracket_time_slots WHERE bracket_id = $1";

        const result = await withClientRollback(async (querier) => {
            const [bracket] = (await querier<BracketDatabaseInterface>(sqlBracket, [bracketId]))
                .rows;

            if (bracket === undefined) {
                return IsRollback;
            }
            const timeSlots = (await querier(sqlTime, [bracket.id])).rows.map((timeSlot) => {
                return new TimeSlot({
                    id: timeSlot.id,
                    startTime: timeSlot.start_time,
                    endTime: timeSlot.end_time,
                    bracketId: timeSlot.bracket_id,
                });
            });

            return new Bracket({
                id: bracket.id,
                dayChoices: bracket.day_choices,
                divisionId: bracket.division_id,
                maxTeamAmount: bracket.max_team_amount,
                teams: [],
                timeSlots,
            });
        });

        if (result === IsRollback) {
            return null;
        }

        return result;
    }

    /**
     * This method works its way up the tree starting with the bracket. Will create
     * nested object list from bracket all the way to the contest.
     *
     * @param bracketId - Bracket id to search with
     * @returns - returns a Contest object with the tree to the bracket
     */
    async findPathByBracketId(bracketId: number): Promise<Contest | null> {
        logger.verbose("Entering method findPathByBracketId()", {
            class: this.className,
            values: bracketId,
        });

        const sqlSelect = `SELECT bracket.id as bracket_id, bracket.day_choices, bracket.max_team_amount, division.id as division_id, division.name as division_name, division.type, division.level, division.max_team_size, division.min_women_count, division.min_men_count, league.id as league_id, league.name as league_name, league.sport, league.start_date as league_start_date, league.end_date as league_end_date, contest.id as contest_id, contest.name as contest_name, contest.visibility, contest.status, contest.date_created, contest.start_date as contest_start_date, contest.end_date as contest_end_date, contest.playoff, contest.playoff_type, contest.playoff_seeding_type, contest.contest_type, contest.organization_id FROM bracket
        INNER JOIN division ON bracket.division_ID=division.id
        INNER JOIN league ON division.league_ID=league.id
        INNER JOIN contest ON league.contest_id=contest.id
        WHERE bracket.id = $1`;

        return withClient(async (querier) => {
            const [res] = (await querier(sqlSelect, [bracketId])).rows;

            if (res === undefined) {
                return null;
            }

            const bracket = new Bracket({
                id: res.bracket_id,
                dayChoices: res.day_choices,
                maxTeamAmount: res.max_team_amount,
                divisionId: res.division_id,
                teams: [],
                timeSlots: [],
            });

            const division = new Division({
                id: res.division_id,
                name: res.division_name,
                type: res.type,
                level: res.level,
                maxTeamSize: res.max_team_size,
                minWomenCount: res.min_women_count,
                minMenCount: res.min_men_count,
                brackets: [bracket],
                leagueId: res.league_id,
            });

            const league = new League({
                id: res.league_id,
                name: res.league_name,
                sport: res.sport,
                startDate: res.league_start_date,
                endDate: res.league_end_date,
                contestId: res.contest_id,
                divisions: [division],
                organizationId: res.organization_id,
            });

            const contest = new Contest({
                id: res.contest_id,
                name: res.contest_name,
                visibility: res.visibility,
                status: res.status,
                dateCreated: res.date_created,
                startDate: res.contest_start_date,
                endDate: res.contest_end_date,
                playoff: res.playoff,
                playoffType: res.playoff_type,
                playoffSeedingType: res.playoff_seeding_type,
                contestType: res.contest_type,
                leagues: [league],
                organizationId: res.organization_id,
            });

            return contest;
        });
    }
}
