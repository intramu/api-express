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
     * Creates player under organization with given id
     * @param player - must not be null
     * @param organizationId - must not be null
     * @returns - the saved player
     * @throws - error when creating player
     */
    async createPlayerByOrganizationId(player: Player, organizationId: string): Promise<Player> {
        logger.verbose("Entering method createPlayerByOrganizationId()", {
            class: this.className,
            values: { player, organizationId },
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
                    organizationId,
                ])
            ).rows;

            if (!response) {
                logger.error("Error creating player", {
                    class: this.className,
                });
                throw new Error("Error creating player");
            }

            return Player.fromDatabase(response);
        });
    }

    /**
     * Creates player invite to team with given ids
     * @param authorizingId - id of player creating invite; must not be null
     * @param inviteeId - id of player receiving invite; must not be null
     * @param teamId - id of team @inviteeId is receiving invite to; must not be null
     * @param inviteExpirationDate - must not be null
     * @returns - the saved player invite
     * @throws - error when creating player invite
     */
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

            if (!invite) {
                logger.error("Error creating invite", {
                    class: this.className,
                });
                throw new Error("Error creating invite");
            }

            return convertFromDatabaseFormat(invite);
        });
    }

    /**
     * Updates player by its id
     * @param player - must not be null
     * @returns - the updated player
     * @throws - error when updating player
     */
    async updatePlayer(player: Player): Promise<Player> {
        logger.verbose("Entering method updatePlayer()", {
            class: this.className,
            values: { player },
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

            if (!response) {
                logger.error("Error updating player", {
                    class: this.className,
                });
                throw new Error("Error updating player");
            }

            return Player.fromDatabase(response);
        });
    }

    /**
     * Patches player by its id
     *
     * If Player object values are null or empty strings, database will leave the current value.
     * @param player - must not be null
     * @returns - the patched player
     * @throws - if error when patching player
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

            if (!response) {
                logger.error(`Error patching player: ${player.getAuthId()}`, {
                    class: this.className,
                });
                throw new Error(`Error patching player: ${player.getAuthId()}`);
            }

            return Player.fromDatabase(response);
        });
    }

    /**
     * Deletes player with the given id
     * @param playerId - must not be null
     * @returns - void
     */
    async deletePlayerById(playerId: string): Promise<void> {
        logger.verbose("Entering method deletePlayerById()", {
            class: this.className,
            values: { playerId },
        });

        const sqlDelete = "DELETE FROM player WHERE auth_id=$1";

        return withClient(async (querier) => {
            await querier(sqlDelete, [playerId]);
        });
    }

    /**
     * Deletes invite from player with given ids.
     *
     * With both ids combined every row in this table should be
     * unique. If an error occurs the ids more than likely were incorrect
     * @param playerId - must not be null
     * @param teamId - must not be null
     * @returns - void
     */
    async deletePlayerInvite(playerId: string, teamId: number): Promise<void> {
        logger.verbose("Entering method deletePlayerInvite()", {
            class: this.className,
            values: { playerId, teamId },
        });

        const sqlDelete = "DELETE FROM player_invites WHERE player_auth_id = $1 AND team_id = $2";

        return withClient(async (querier) => {
            await querier(sqlDelete, [playerId, teamId]);
        });
    }

    /**
     * Retrieves player by its id
     * @param playerId - must not be null
     * @returns - player with given id or null if not found
     */
    async findPlayerById(playerId: string): Promise<Player | null> {
        logger.verbose("Entering method findPlayerById()", {
            class: this.className,
            values: { playerId },
        });

        const sqlSelect = "SELECT * FROM player WHERE auth_id=$1";

        return withClient(async (querier) => {
            const [response] = (await querier<IPlayerDatabase>(sqlSelect, [playerId])).rows;

            return !response ? null : Player.fromDatabase(response);
        });
    }

    /**
     * Returns all instances of player
     * @returns - player list
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
     * Returns all instances of player with given organization id
     * @param orgId - must not be null
     * @returns - player list with the given id
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
     * Returns all instances of player invites with given player id
     * @param authId - must not be null
     * @returns - player invite list with the given id
     */
    async findAllPlayerInvites(authId: string): Promise<IPlayerInvite[]> {
        logger.verbose("Entering method findAllPlayerInvites()", {
            class: this.className,
            values: { authId },
        });

        const sql = "SELECT * FROM player_invites WHERE player_auth_id = $1";

        return withClient(async (querier) => {
            const invites = (await querier<IPlayerInviteDatabase>(sql, [authId])).rows;

            return invites.map((invite) => convertFromDatabaseFormat(invite));
        });
    }

    /**
     * Retrieves player by its name;
     * Can be first, last or both
     * @param name - must not be null
     * @param orgId - id of organization to search under
     * @returns - player list with given names and id
     */
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
