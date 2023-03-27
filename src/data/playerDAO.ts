import { IPlayerDatabase } from "../interfaces/IPlayer";
import {
    convertFromDatabaseFormat,
    IPlayerInvite,
    IPlayerInviteDatabase,
} from "../interfaces/IPlayerInvite";
import { Player } from "../models/Player";
import logger from "../utilities/winstonConfig";

import { withClient } from "./database";

export default class PlayerDAO {
    className = this.constructor.name;

    /**
     * Returns the organization id by searching for the player
     * @param playerId - auth id of player
     * @returns - organization id or null if error
     */
    async findOrganizationIdByPlayerId(playerId: string): Promise<string | null> {
        logger.verbose("Entering method findOrganizationIdByPlayerId()", {
            class: this.className,
            values: playerId,
        });

        const sqlFind = "SELECT organization_id FROM player WHERE auth_id = $1";

        return withClient(async (querier) => {
            const [response] = (await querier(sqlFind, [playerId])).rows;
            if (response === undefined) {
                return null;
            }

            return response.organization_id;
        });
    }

    /**
     * Creates player under organization using id. Any new player must belong to an organization
     * @param player - Player object to be added
     * @returns - Player object or null
     */
    async createPlayerByOrganizationId(player: Player, orgId: string): Promise<Player> {
        logger.verbose("Entering method createPlayerByOrganizationId()", {
            class: this.className,
            values: { player, orgId },
        });

        return withClient(async (querier) => {
            const sqlInsert =
                "INSERT INTO player (AUTH_ID, FIRST_NAME, LAST_NAME, LANGUAGE, STATUS, GENDER, EMAIL_ADDRESS, DOB, VISIBILITY, GRADUATION_TERM, IMAGE, organization_ID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *";

            const [response] = (
                await querier<IPlayerDatabase>(sqlInsert, [
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
            ).rows;

            if (response === undefined) {
                logger.error("Error creating player under organization", {
                    class: this.className,
                });
                throw new Error("Error creating player under organization");
            }

            return Player.fromDatabase(response);
        });
    }

    /**
     * Completely updates player in database changing all values
     * @param player - Player object with new values
     * @returns - Newly updated Player object or null
     */
    async updatePlayer(player: Player): Promise<Player | null> {
        logger.verbose("Entering method updatePlayer()", {
            class: this.className,
        });

        const sqlUpdate =
            "UPDATE player SET first_name=$1, last_name=$2, language=$3, status=$4, gender=$5, email_address=$6, dob=$7, visibility=$8, graduation_term=$9, image=$10 WHERE auth_id=$11 RETURNING *";

        return withClient(async (querier) => {
            const [response] = (
                await querier<IPlayerDatabase>(sqlUpdate, [
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
                ])
            ).rows;

            if (response === undefined) {
                return null;
            }

            return Player.fromDatabase(response);
        });
    }

    /**
     * Will remove player from database, also removes from any teams
     * @param playerId - id of player
     * @returns - id of player or null
     */
    async deletePlayerById(playerId: string): Promise<boolean> {
        logger.verbose("Entering method deletePlayerById()", {
            class: this.className,
        });

        const sqlDelete = "DELETE FROM player WHERE auth_id=$1";

        return withClient(async (querier) => {
            const [response] = (await querier(sqlDelete, [playerId])).rows;

            if (response === undefined) {
                return false;
            }

            return true;
        });
    }

    /**
     * Find player by id in database
     * @param playerId - id of player
     * @returns - Player object or null
     */
    async findPlayerById(playerId: string): Promise<Player | null> {
        logger.verbose("Entering method findPlayerById()", {
            class: this.className,
        });

        const sqlSelect = "SELECT * FROM player WHERE auth_id=$1";

        return withClient(async (querier) => {
            const [response] = (await querier<IPlayerDatabase>(sqlSelect, [playerId])).rows;

            if (response === undefined) {
                return null;
            }

            return Player.fromDatabase(response);
        });
    }

    /**
     * Finds all players in entire database
     * @returns - list of Player objects
     */
    // TODO: add paging in future to reduce returned content
    async findAllPlayers(): Promise<Player[]> {
        logger.verbose("Entering method findPlayers()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM player";

        return withClient(async (querier) => {
            const response = (await querier<IPlayerDatabase>(sqlAll)).rows;

            return response.map((player: IPlayerDatabase) => Player.fromDatabase(player));
        });
    }

    /**
     * Finds all players in database under organization
     * @param orgId - organization id to look for players under
     * @returns - List of Player objects
     */
    // TODO: add paging in future to reduce returned content
    async findAllPlayersByOrganizationId(orgId: string): Promise<Player[]> {
        logger.verbose("Entering method findPlayersByOrganizationId()", {
            class: this.className,
        });

        const sqlSelect = "SELECT * FROM player WHERE organization_id=$1";

        return withClient(async (querier) => {
            const response = (await querier<IPlayerDatabase>(sqlSelect, [orgId])).rows;

            return response.map((player) => Player.fromDatabase(player));
        });
    }

    /**
     * Patches the player object rather than updating. If Player object values are null or empty strings,
     * database will leave the current value.
     * @param player - player object with values
     * @returns - updated Player object or null
     */
    async patchPlayer(player: Player): Promise<Player> {
        logger.verbose("Entering method patchPlayer()", {
            class: this.className,
            values: player,
        });

        // NR - I don't know how I feel about this. I would like to rather be able to set firstName
        // to null, but that doesn't seem right either.
        const firstName = player.getFirstName() || null;
        const lastName = player.getLastName() || null;
        const emailAddress = player.getEmailAddress() || null;
        const graduationTerm = player.getGraduationTerm() || null;
        const image = player.getImage() || null;

        const sqlPatch =
            "UPDATE player SET first_name=COALESCE($1, first_name), last_name=COALESCE($2, last_name), language=COALESCE($3, language), status=COALESCE($4, status), gender=COALESCE($5, gender), email_address=COALESCE($6, email_address), dob=COALESCE($7, dob), visibility=COALESCE($8, visibility), graduation_term=COALESCE($9, graduation_term), image=COALESCE($10, image) WHERE auth_id=$11 RETURNING *";

        return withClient(async (querier) => {
            const [response] = (
                await querier<IPlayerDatabase>(sqlPatch, [
                    firstName,
                    lastName,
                    player.getLanguage(),
                    player.getStatus(),
                    player.getGender(),
                    emailAddress,
                    player.getDob(),
                    player.getVisibility(),
                    graduationTerm,
                    image,
                    player.getAuthId(),
                ])
            ).rows;

            if (response === undefined) {
                logger.error(`Error patching player: ${player.getAuthId()}`, {
                    class: this.className,
                });
                throw new Error(`Error patching player: ${player.getAuthId()}`);
            }

            return Player.fromDatabase(response);
        });
    }

    async createPlayerInvite(
        authorizingId: string,
        inviteeId: string,
        teamId: number,
        inviteExpirationDate: Date
    ): Promise<IPlayerInvite> {
        logger.verbose("Entering method createPlayerInvite()", {
            class: this.className,
            values: { authorizingId, inviteeId, teamId, inviteExpirationDate },
        });

        /** CTE first finds player name,
         * then finds team name,
         * then adds both to the invite.
         *
         * Will fail if no player or team is found*/
        const sqlCte = `with player AS (
            SELECT first_name, last_name FROM player WHERE auth_id = $1
        ),
        team AS (
            SELECT name FROM team WHERE id = $2
        )
        INSERT INTO player_invites (player_auth_id, team_id, requesting_player_full_name, requesting_team_name, expiration_time) VALUES($3, $4, 
            (SELECT CONCAT(first_name, ' ', last_name) FROM player), 
            (SELECT CONCAT(name) FROM team),
            $5) 
            RETURNING *`;

        return withClient(async (querier) => {
            const [invite] = (
                await querier<IPlayerInviteDatabase>(sqlCte, [
                    authorizingId,
                    teamId,
                    inviteeId,
                    teamId,
                    inviteExpirationDate,
                ])
            ).rows;

            if (invite === undefined) {
                logger.error("Error creating invite", {
                    class: this.className,
                });
                throw new Error("Error creating invite");
            }

            return convertFromDatabaseFormat(invite);
        });
    }

    /**
     * Removes invite from the players invites. With both ids combined every row in this table should be
     * unique. If an error occurs the ids more than likely were incorrect
     * @param playerId - id of the player
     * @param teamId - team id
     * @returns - authId of the player on invite
     */
    async deletePlayerInvite(playerId: string, teamId: number): Promise<boolean> {
        logger.verbose("Entering method deletePlayerInvite()", {
            class: this.className,
            values: {
                playerId,
                teamId,
            },
        });

        const sqlDelete = "DELETE FROM player_invites WHERE player_auth_id = $1 AND team_id = $2";

        return withClient(async (querier) => {
            const [results] = (await querier(sqlDelete, [playerId, teamId])).rows;

            if (results === undefined) {
                return false;
            }

            return true;
        });
    }

    async findAllPlayerInvitesById(authId: string): Promise<IPlayerInvite[]> {
        logger.verbose("Entering method findAllPlayerInvitesById()", {
            class: this.className,
            values: { authId },
        });

        const sql = "SELECT * FROM player_invites WHERE player_auth_id = $1";

        return withClient(async (querier) => {
            const invites = (await querier<IPlayerInviteDatabase>(sql, [authId])).rows;

            return invites.map((invite) => convertFromDatabaseFormat(invite));
        });
    }

    async findPlayerByName(name: string, orgId?: string): Promise<Player[]> {
        logger.verbose("Entering method findPlayerByName()", {
            class: this.className,
            values: { name },
        });

        /** Looks for all players where the provided name is like the concatted first name and last name
         * A organization id can optionally be provided to filter more
         */
        const sql = `SELECT * FROM player 
        WHERE (first_name || last_name) 
        ILIKE $1 AND organization_id = COALESCE($2, organization_id)`;

        // TODO: prob add pagination for this
        return withClient(async (querier) => {
            const players = (await querier<IPlayerDatabase>(sql, [`%${name}%`, orgId ?? null]))
                .rows;

            return players.map((player) => Player.fromDatabase(player));
        });
    }
}

const test = new PlayerDAO();

testFunc();

async function testFunc() {
    // console.log(await test.deletePlayerInvite("player4", 12));
    // console.log(
    //     await test.createPlayerInvite(
    //         "auth0|62760b4733c477006f82c56d",
    //         "auth0|62760b4733c477006f82c56c",
    //         15,
    //         new Date()
    //     )
    // );
    // console.log(await test.deletePlayerById("player4"));
    // test.findTeamsByPlayerId("auth0|62760b4733c477006f82c56d");
    // await test.findPlayerById("player12");
    // console.log(
    //     await test.createPlayerByOrganizationId(player, "03503875-f4a2-49f6-bb9f-e9a22fb852d4")
    // );
    // console.log(await test.findPlayersByTeamId(12));
    // console.log(await test.updatePlayer(player));
    // console.log(await test.patchPlayer(player));
    // await test.findPlayerByName("thomas", "dab32727-cb7c-4320-8865-6f1b842785ee");
}
