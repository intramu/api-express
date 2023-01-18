/* eslint-disable consistent-return */
import { Player } from "../models/Player";
import { PlayerSmall } from "../models/PlayerSmall";
import { Team } from "../models/Team";
import { Gender, Status, Visibility } from "../utilities/enums";
import logger from "../utilities/winstonConfig";

import { db, withClient } from "./database";

// todo: Return types?
export default class PlayerDAO {
    className = this.constructor.name;

    async findTeamsByPlayerId() {
        logger.verbose("Entering method findAllTeamsByPlayerId()", {
            class: this.className,
        });

        let client = null;

        const sql =
            "SELECT team.ID as team_ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.SPORT, team.DATE_CREATED, team.MAX_TEAM_SIZE, tr.ROLE, tr.player_AUTH_ID, player.FIRST_NAME, player.LAST_NAME, player.GENDER FROM team team JOIN team_roster tr on(team.ID = tr.team_ID) JOIN player player on(tr.player_AUTH_ID = player.AUTH_ID) WHERE tr.team_ID IN (SELECT team_ID FROM team_roster WHERE player_AUTH_ID = ?) ORDER BY tr.team_ID ASC";
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
            "INSERT INTO team (name, wins, ties, losses, image, visibility, sport, sportsmanship_score, status, max_team_size, organization_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING ID";

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

    async createPlayerByOrganizationId(player: Player): Promise<Player | null> {
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
                player.getOrganizationId(),
            ]);

            const [results] = response.rows;

            if (results === undefined) {
                return null;
            }

            return new Player(
                results.auth_id,
                results.first_name,
                results.last_name,
                results.language,
                results.emailAddress,
                null,
                results.gender,
                results.dob,
                results.visibility,
                results.graduation_term,
                results.image,
                results.status,
                results.date_created,
                results.organization_id
            );
        });
    }

    async updatePlayer(player: Player): Promise<Player | null> {
        logger.verbose("Entering method updatePlayer()", {
            class: this.className,
        });

        const sqlUpdate =
            "UPDATE player SET first_name=$1, last_name=$2, language=$3, status=$4, gender=$5, email_address=$6, dob=$7, visibility=$8, graduation_term=$9, image=$10 WHERE auth_id=$11 RETURNING *";

        return withClient(async (querier) => {
            const response = await querier(sqlUpdate, [
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
                player.getAuthId(),
            ]);

            const [results] = response.rows;

            if (response.rowCount === 0) {
                return null;
            }

            return new Player(
                results.auth_id,
                results.first_name,
                results.last_name,
                results.language,
                results.emailAddress,
                null,
                results.gender,
                results.dob,
                results.visibility,
                results.graduation_term,
                results.image,
                results.status,
                results.date_created,
                results.organization_id
            );
        });
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

    async findPlayerById(playerId: string): Promise<Player | null> {
        logger.verbose("Entering method findPlayerById()", {
            class: this.className,
        });

        const sqlSelect = "SELECT * FROM player WHERE auth_id=$1";

        return withClient(async (querier) => {
            const response = await querier(sqlSelect, [playerId]);
            const [results] = response.rows;

            if (results === undefined) {
                return null;
            }

            return new Player(
                results.auth_id,
                results.first_name,
                results.last_name,
                results.language,
                results.emailAddress,
                null,
                results.gender,
                results.dob,
                results.visibility,
                results.graduation_term,
                results.image,
                results.status,
                results.date_created,
                results.organization_id
            );
        });
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

    async patchPlayer(player: Player): Promise<Player | null> {
        logger.verbose("Entering method patchPlayer()", {
            class: this.className,
            values: player,
        });

        // NR - I don't know how I feel about this. I would like to rather be able to set firstName
        // to null, but that doesn't seem right either.
        const firstName = player.getFirstName() === "" ? null : player.getFirstName();
        const lastName = player.getLastName() === "" ? null : player.getLastName();
        const language = player.getLanguage() === "" ? null : player.getLanguage();
        const emailAddress = player.getEmailAddress() === "" ? null : player.getEmailAddress();
        const graduationTerm =
            player.getGraduationTerm() === "" ? null : player.getGraduationTerm();

        const sqlPatch =
            "UPDATE player SET first_name=COALESCE($1, first_name), last_name=COALESCE($2, last_name), language=COALESCE($3, language), status=COALESCE($4, status), gender=COALESCE($5, gender), email_address=COALESCE($6, email_address), dob=COALESCE($7, dob), visibility=COALESCE($8, visibility), graduation_term=COALESCE($9, graduation_term), image=COALESCE($10, image) WHERE auth_id=$11 RETURNING *";

        return withClient(async (querier) => {
            const response = await querier(sqlPatch, [
                firstName,
                lastName,
                language,
                player.getStatus(),
                player.getGender(),
                emailAddress,
                player.getDob(),
                player.getVisibility(),
                graduationTerm,
                player.getImage(),
                player.getAuthId(),
            ]);
            const [results] = response.rows;

            if (results === undefined) {
                return null;
            }

            return new Player(
                results.auth_id,
                results.first_name,
                results.last_name,
                results.language,
                results.emailAddress,
                null,
                results.gender,
                results.dob,
                results.visibility,
                results.graduation_term,
                results.image,
                results.status,
                results.date_created,
                results.organization_id
            );
        });
    }

    async findPlayersByTeamId(teamId: number): Promise<PlayerSmall[] | null> {
        logger.verbose("Entering method findPlayersByTeamId()", {
            class: this.className,
        });

        const sqlJoin =
            "SELECT team_roster.role, player.auth_id, player.first_name, player.last_name, player.gender, player.status, player.image FROM team_roster JOIN player ON team_roster.player_AUTH_ID = player.auth_ID WHERE team_roster.team_ID = $1";

        return withClient(async (querier) => {
            const response = await querier(sqlJoin, [teamId]);
            const results = response.rows;

            const playerList = results.map(
                (result) =>
                    new PlayerSmall(
                        result.auth_id,
                        result.role,
                        result.first_name,
                        result.last_name,
                        result.gender,
                        result.status,
                        result.image
                    )
            );

            return playerList;
        });
    }
}

const test = new PlayerDAO();

const player = new Player(
    "test4947",
    "",
    "",
    "",
    "michaelbittner@hotmail.com",
    null,
    null,
    null,
    Visibility.CLOSED,
    "SPRING_2025",
    null,
    Status.INCOMPLETE,
    null,
    "ea9dc7a5-5e40-4715-b8d9-4b7acf4a2291"
);

testFunc();

async function testFunc() {
    // await test.findPlayerById("player12");
    // console.log(
    //     await test.createPlayerByOrganizationId(player, "03503875-f4a2-49f6-bb9f-e9a22fb852d4")
    // );
    // console.log(await test.findPlayersByTeamId(12));
    // console.log(await test.updatePlayer(player));
    // console.log(await test.patchPlayer(player));
}
// console.log(test.createPlayerByOrganizationId(player, "7f83b6f4-754a-4f34-913d-907c1226321f"))
// // test.deletePlayerById("test4934")
// // test.findPlayersByOrganizationId("ea9dc7a5-5e40-4715-b8d9-4b7acf4a2291")
// // test.findPlayers()
// // test.addToTeamRoster(1, "test4935")
// test.findPlayersByTeamId(12);
