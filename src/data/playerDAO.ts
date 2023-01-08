/* eslint-disable consistent-return */
import { Player } from "../models/Player";
import { Team } from "../models/Team";
import { Gender } from "../utilities/enums";
import logger from "../utilities/winstonConfig";

import { db, withClient } from "./database";

// todo: Return types?
export default class playerDAO {
    className = this.constructor.name;

    async findTeams() {
        logger.verbose("Entering method findAllTeams()", {
            class: this.className,
        });

        let client = null;

        const sqlAll = "SELECT * FROM team";
        try {
            client = await db.connect();
            const response = await client.query(sqlAll);
            const results = response.rows;

            console.log(results);
            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async findTeamsByOrganizationId(orgId: string) {
        logger.verbose("Entering method findAllTeamsByOrganizationId()", {
            class: this.className,
        });

        let client = null;

        const sqlAll = "SELECT * FROM team WHERE organization_id = $1";
        try {
            client = await db.connect();
            const response = await client.query(sqlAll, [orgId]);
            const results = response.rows;
            console.log(results);
            // return results
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async findTeamsByPlayerId() {
        logger.verbose("Entering method findAllTeamsByPlayerId()", {
            class: this.className,
        });

        let client = null;

        const sql =
            ' "SELECT team.ID as team_ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.SPORT, team.DATE_CREATED, team.MAX_TEAM_SIZE, tr.ROLE, tr.player_AUTH_ID, player.FIRST_NAME, player.LAST_NAME, player.GENDER FROM team team JOIN team_roster tr on(team.ID = tr.team_ID) JOIN player player on(tr.player_AUTH_ID = player.AUTH_ID) WHERE tr.team_ID IN (SELECT team_ID FROM team_roster WHERE player_AUTH_ID = ?) ORDER BY tr.team_ID ASC";';
        try {
            client = await db.connect();
            const response = await client.query(sql);
            const results = response.rows;
            console.log(results);
            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async createTeamByOrganizationId(team: Team) {
        logger.verbose("Entering method createTeamByOrganizationId()", {
            class: this.className,
        });

        let client = null;

        const sqlCreate =
            "INSERT INTO team (name, wins, ties, losses, image, visibility, sport, sportsmanship_score, status, max_team_size, women_count, men_count, organization_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING ID";

        try {
            client = await db.connect();
            const response = await client.query(sqlCreate, [
                team.getName(),
                team.getWins(),
                team.getTies(),
                team.getLosses(),
                team.getImage(),
                team.getVisibility(),
                team.getSport(),
                team.getSportsmanshipScore(),
                team.getStatus(),
                team.getMaxTeamSize(),
                team.getWomenCount(),
                team.getMenCount(),
                team.getOrganizationId(),
            ]);
            const results = response.rows;
            console.log(results);

            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async createPlayerByOrganizationId(player: Player, orgId: string): Promise<Player|null> {
        logger.verbose("Entering method createPlayerByOrganizationId()", {
            class: this.className,
        });

        return withClient(async (querier) => {
            const sqlInsert =
            "INSERT INTO player (AUTH_ID, FIRST_NAME, LAST_NAME, LANGUAGE, STATUS, GENDER, EMAIL_ADDRESS, DOB, VISIBILITY, GRADUATION_TERM, IMAGE, organization_ID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *";

            const response = await querier(sqlInsert, [
                player.getAuthId(),
                player.getFirstName(),
                player.getLastName(),
                player.getLanguage(),
                player.getStatus(),
                player.getGender(),
                player.getEmailAddress(),
                player.getDob(),
                player.getVisibility(),
                player.getGraduationTerm(),
                player.getImage(),
                orgId,
            ])

            const result = response.rows

            if(result.length === 0){
                return null;
            }
            
            console.log(result);
            
            return null
            // return new Player(result.)
        })
    }

    async updatePlayer(player: Player) {
        logger.verbose("Entering method updatePlayer()", {
            class: this.className,
        });

        let client = null;

        const sqlUpdate =
            "UPDATE player SET first_name=$1, last_name=$2, language=$3, status=$4, gender=$5, email_address=$6, dob=$7, visibility=$8, graduation_term=$9, image=$10 WHERE auth_id=$12 RETURNING *";

        try {
            client = await db.connect();
            const response = await client.query(sqlUpdate, [
                player.getFirstName(),
                player.getLastName(),
                player.getLanguage(),
                player.getStatus(),
                player.getGender(),
                player.getEmailAddress(),
                player.getDob(),
                player.getVisibility(),
                player.getGraduationTerm(),
                player.getImage(),
            ]);
            const results = response.rows;
            console.log(results);
            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async deletePlayerById(playerId: string) {
        logger.verbose("Entering method deletePlayerById()", {
            class: this.className,
        });

        let client = null;

        const sqlDelete = "DELETE FROM player WHERE auth_id=$1 RETURNING auth_id";
        try {
            client = await db.connect();
            const response = await client.query(sqlDelete, [playerId]);
            const results = response.rows;
            console.log(results);
            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async findPlayerById(playerId: string) {
        logger.verbose("Entering method findPlayerById()", {
            class: this.className,
        });

        let client = null;

        const sqlSelect = "SELECT * FROM player WHERE auth_id=$1";
        try {
            client = await db.connect();
            const response = await client.query(sqlSelect, [playerId]);
            const results = response.rows;
            console.log(results);
            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async findPlayers() {
        logger.verbose("Entering method findPlayers()", {
            class: this.className,
        });

        let client = null;

        const sqlAll = "SELECT * FROM player";
        try {
            client = await db.connect();
            const response = await client.query(sqlAll);
            const results = response.rows;
            console.log(results);
            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async findPlayersByOrganizationId(orgId: string) {
        logger.verbose("Entering method findPlayersByOrganizationId()", {
            class: this.className,
        });

        let client = null;

        const sqlSelect = "SELECT * FROM player WHERE organization_id=$1";
        try {
            client = await db.connect();
            const response = await client.query(sqlSelect, [orgId]);
            const results = response.rows;
            console.log(results);
            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async addToTeamRoster(teamId: number, playerId: string) {
        logger.verbose("Entering method addToTeamRoster()", {
            class: this.className,
        });

        let client = null;

        const sqlAddPlayer = "INSERT INTO team_roster (player_AUTH_ID, team_ID) VALUES ($1, $2)";

        const sqlSearch = "SELECT GENDER FROM player WHERE auth_ID=$1";

        const sqlTeamSizeMen = "UPDATE team SET MEN_COUNT = MEN_COUNT + 1 WHERE ID = $1";
        const sqlTeamSizeWomen = "UPDATE team SET WOMEN_COUNT = WOMEN_COUNT + 1 WHERE ID = $1";

        try {
            client = await db.connect();
            await client.query("BEGIN");

            await client.query(sqlAddPlayer, [playerId, teamId]);

            const response = await client.query(sqlSearch, [playerId]);
            const results = response.rows;
            const [user] = results;

            if (user.gender === Gender.MALE) {
                await client.query(sqlTeamSizeMen, [teamId]);
            }
            await client.query(sqlTeamSizeWomen, [teamId]);

            // const team: Team = { players: [] } as any;
            // ! Note for Noah
            // const menCount = team
            //     .getPlayers()
            //     .filter((player) => player.getGender() === "male").length;

            await client.query("COMMIT");

            console.log("FINISHED");

            return 1;
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            await client?.query("ROLLBACK");

            return null;
        } finally {
            client?.release();
        }
    }

    async removeFromTeamRoster(teamId: number, playerId: string) {
        logger.verbose("Entering method removeFromTeamRoster()", {
            class: this.className,
        });

        let client = null;

        const sqlRemove = "DELETE FROM team_roster WHERE player_AUTH_ID=$1 AND team_ID=$2";

        try {
            client = await db.connect();
            const response = await client.query(sqlRemove, [playerId, teamId]);
            const results = response;
            console.log(results);
            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async updateToTeamRoster(teamId: number, playerId: string, role: string) {
        logger.verbose("Entering method updateToTeamRoster()", {
            class: this.className,
        });

        let client = null;

        const sqlUpdate = "UPDATE team_roster SET ROLE=$1 WHERE team_ID=$2 AND player_AUTH_ID=$3";

        try {
            client = await db.connect();
            const response = await client.query(sqlUpdate, [role, teamId, playerId]);
            const results = response.rows;
            console.log(results);
            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }

    async findPlayersByTeamId(teamId: number) {
        logger.verbose("Entering method ...()", {
            class: this.className,
        });

        let client = null;

        const sqlJoin =
            "SELECT * FROM team_roster RIGHT JOIN player ON team_roster.player_AUTH_ID = player.auth_ID WHERE team_roster.team_ID = $1";
        try {
            client = await db.connect();
            const response = await client.query(sqlJoin, [teamId]);
            const results = response.rows;
            console.log(results);
            // return results
        } catch (error) {
            logger.error("Database Connection / Query Error", {
                type: error,
                class: this.className,
            });
            return null;
        } finally {
            client?.release();
        }
    }
}

const test = new playerDAO();

// const team = new Team(
//     0,
//     "Team Anderson",
//     null,
//     0,
//     0,
//     null,
//     "",
//     "SOCCER",
//     null,
//     0,
//     "",
//     null,
//     0,
//     0,
//     [],
//     "ea9dc7a5-5e40-4715-b8d9-4b7acf4a2291"
// );
// // test.createTeam(team)
// // test.findAllTeams()
// // test.findAllTeamsByOrganizationId("ea9dc7a5-5e40-4715-b8d9-4b7acf4a2291")
const player = new Player(
    "test4935",
    "Jacob",
    "Hropoff",
    "",
    "noahr1936@gmail.com",
    null,
    "MALE",
    new Date(),
    "",
    "SPRING_2023",
    null,
    "",
    new Date()
);
test.createPlayerByOrganizationId(player, "ea9dc7a5-5e40-4715-b8d9-4b7acf4a2291")
// // test.deletePlayerById("test4934")
// // test.findPlayersByOrganizationId("ea9dc7a5-5e40-4715-b8d9-4b7acf4a2291")
// // test.findPlayers()
// // test.addToTeamRoster(1, "test4935")
// test.findPlayersByTeamId(1);
