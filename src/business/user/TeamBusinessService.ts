import OrganizationDAO from "../../data/organizationDAO";
import PlayerDAO from "../../data/playerDAO";
import TeamDAO from "../../data/teamDAO";
import { TeamNew } from "../../interfaces/Team";
import { APIResponse } from "../../models/APIResponse";
import { Team } from "../../models/Team";
import { TeamRole, TeamStatus, TeamVisibility } from "../../utilities/enums/teamEnum";
import logger from "../../utilities/winstonConfig";

const playerDatabase = new PlayerDAO();
const teamDatabase = new TeamDAO();
const organizationDatabase = new OrganizationDAO();

export class TeamBusinessService {
    readonly className = this.constructor.name;
    // REVISIT - many of these methods need to be changed to search for entities based on the passed in player auth id, rather than using organization id.

    /**
     * Creates new team, player becomes captain
     *
     * @param team - team object passed to database
     * @param playerId - player that will be set as captain of the team
     * @returns - returns single team object with added details
     */
    async createTeam(newTeam: TeamNew, playerId: string): Promise<APIResponse | Team> {
        logger.verbose("Entering method createTeam()", {
            class: this.className,
            values: newTeam,
        });

        const organization = await organizationDatabase.findOrganizationByPlayerId(playerId);
        if (organization === null) {
            return APIResponse[404](`No player found with id: ${playerId}`);
        }

        const team = new Team({
            id: null,
            name: newTeam.name,
            wins: 0,
            ties: 0,
            losses: 0,
            // todo: images
            image: "",
            visibility: newTeam.visibility,
            sport: newTeam.sport,
            dateCreated: null,
            sportsmanshipScore: 4.0,
            status: TeamStatus.UNELIGIBLE,
            // todo: get max team size
            maxTeamSize: 12,
            players: [],
            organizationId: organization.getId(),
            bracketId: null,
        });

        const response = await teamDatabase.createTeam(team, playerId);
        if (response === null) {
            return APIResponse[500]("Error creating team");
        }

        return response;
    }

    /**
     * Shows all teams active teams available for this term.
     * Active teams are defined as eligible or uneligible. Does not include past semester teams
     * These teams appear in discovery section.
     * @returns - list of active teams
     */
    async findAllActiveTeams(orgId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findAllActiveTeams()", {
            class: this.className,
            values: orgId,
        });

        const response = await teamDatabase.findAllTeamsByOrganizationId(orgId);

        if (response.length === 0 || response === undefined) {
            return APIResponse[404](`No teams found with id ${orgId}`);
        }

        const teamList = response.filter(
            (team) =>
                team.getStatus() === TeamStatus.ELIGIBLE ||
                team.getStatus() === TeamStatus.UNELIGIBLE
        );

        return teamList;
    }

    /**
     * Returns all teams under organization regardless of status.
     * todo: figure out how to set this up so a user can pass in query parameter on
     * API without this having to call a different method.
     * @param orgId
     * @returns
     */
    async findAllTeamsByOrganizationId(orgId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findAllTeamsByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        const org = await organizationDatabase.findOrganizationById(orgId);
        if (org === null) {
            return APIResponse[404](`No organization found with id: ${orgId}`);
        }

        const response = await teamDatabase.findAllTeamsByOrganizationId(orgId);
        if (response.length === 0) {
            return APIResponse[404](`No teams found with organization id: ${orgId}`);
        }

        return response;
    }

    /**
     * Adds player to team only if the team is public
     * @param playerId - id of player to add to team
     * @param teamId - id of team player is being added too
     * @returns - error response or true if success
     */
    async joinTeam(playerId: string, teamId: number): Promise<APIResponse | boolean> {
        logger.verbose("Entering method joinTeam()", {
            class: this.className,
        });

        // REVISIT
        const team = await teamDatabase.findTeamByIdWithPlayers(teamId);

        // checks of team exists, then if team is full, then if team is public,
        // then to see if player is already on team
        if (team === null) {
            return APIResponse[404](`No Team found with id: ${teamId}`);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (team.getPlayers().length >= team.getMaxTeamSize()!) {
            return APIResponse[409](`Team is full. Max size: ${team.getMaxTeamSize()}`);
        }
        if (team.getVisibility() === TeamVisibility.PRIVATE) {
            return APIResponse[403](`Team visibility: ${team.getVisibility()}`);
        }
        if (team.getPlayers().some((player) => player.getAuthId() === playerId)) {
            return APIResponse[409](`Player ${playerId} is already on team`);
        }

        // if all checks out, add player to team
        const responseAdd = await teamDatabase.addToTeamRoster(teamId, playerId, TeamRole.PLAYER);
        if (!responseAdd) {
            return APIResponse[500]("Error adding player to roster");
        }

        return true;
    }

    /**
     * Kicks player from team roster. Authorizing id must come from captain or co-captain
     * on team roster.
     * @param playerId - id of player to be kicked from team
     * @param teamId - id of team player will be kicked from
     * @param authorizingId - id of captain or co-captain on team
     * @returns - error response or true for success
     */
    async kickPlayerFromTeam(
        playerId: string,
        teamId: number,
        authorizingId: string
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method kickPlayerFromTeam()", {
            class: this.className,
            values: { playerId, teamId, authorizingId },
        });

        const players = await playerDatabase.findPlayersByTeamId(teamId);

        // checks if team exists, then if authorizing id is a captain or co-captain,
        // then if player was even on team
        if (players === null || !players.length) {
            return APIResponse[404](`No team found with id: ${teamId}`);
        }
        if (
            !players.find(
                (player) =>
                    player.getAuthId() === authorizingId &&
                    (player.getRole() === TeamRole.CAPTAIN ||
                        player.getRole() === TeamRole.COCAPTAIN)
            )
        ) {
            return APIResponse[403](`Id: ${authorizingId} not authorized`);
        }
        if (!players.find((player) => player.getAuthId() === playerId)) {
            return APIResponse[404](`Player: ${playerId} to kick not found`);
        }

        // if all checks out player is removed from team roster
        const response = await teamDatabase.removeFromTeamRoster(teamId, playerId);
        if (!response) {
            return APIResponse[500]("Error removing player from roster");
        }

        return true;
    }

    /**
     * Returns details on team by searching with id
     * @param teamId - id of team to search with
     * @returns - error response or team object
     */
    async findTeamById(teamId: number): Promise<APIResponse | Team> {
        logger.verbose("Entering method findTeamById()", {
            class: this.className,
        });

        const team = await teamDatabase.findTeamByIdWithPlayers(teamId);

        if (team === null) {
            return APIResponse[404](`No team found with id: ${teamId}`);
        }

        return team;
    }

    /**
     * Patches team details with id that exists on team object. This method only patches
     * object in database
     * @param team - new team details
     * @returns - error response or newly updated team object
     */
    async patchTeam(team: Team): Promise<APIResponse | Team> {
        logger.verbose("Entering method patchTeam()", {
            class: this.className,
        });

        const result = await teamDatabase.findTeamById(team.getId()!);

        if (result === null) {
            return APIResponse[404](`No team found with id: ${team.getId()}`);
        }

        const updatedTeam = await teamDatabase.patchTeam(team);

        if (updatedTeam === null) {
            return APIResponse[500](`Error updating team: ${team.getId()}`);
        }

        return updatedTeam;
    }

    /**
     * Makes request for a player to join a team
     * @param playerId - id of player wanting to join team
     * @param teamId - id of team
     * @returns - error response or true if success
     */
    async requestToJoinTeam(playerId: string, teamId: number): Promise<APIResponse | true> {
        logger.verbose("Entering method requestToJoinTeam()", {
            class: this.className,
            values: {
                playerId,
                teamId,
            },
        });

        const team = await teamDatabase.findTeamByIdWithPlayers(teamId);
        if (team === null) {
            return APIResponse[404](`Team id: ${teamId} not found`);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (team.getPlayers().length > team.getMaxTeamSize()!) {
            return APIResponse[409](`Team id: ${teamId} is full`);
        }

        // expiration date is set one week out
        const date = new Date();
        date.setDate(date.getDate() + 7);
        const response = await teamDatabase.createJoinRequest(teamId, playerId, date);
        if (response === false) {
            APIResponse[500](`Error requesting to join team: ${teamId}`);
        }

        return true;
    }

    /**
     * Accepts invite that a player sent to join a team
     * @param requesteeId - id of player wanting to join team
     * @param acepteeId - id of captain or co-captain accepting invite
     * @param teamId - id of team player is joining.
     * @returns - error response or true if success
     */
    async acceptJoinRequest(
        requesteeId: string,
        acepteeId: string,
        teamId: number
    ): Promise<APIResponse | true> {
        logger.verbose("Entering method acceptJoinRequest()", {
            class: this.className,
            values: {
                requesteeId,
                acepteeId,
                teamId,
            },
        });

        // check if team exists
        const team = await teamDatabase.findTeamByIdWithPlayers(teamId);
        if (team === null) {
            return APIResponse[404](`No team found with id: ${teamId}`);
        }
        // check that aceptee id possesses valid rights to accept join request
        if (
            !team
                .getPlayers()
                .some(
                    (player) =>
                        (player.getAuthId() === acepteeId &&
                            player.getRole() === TeamRole.CAPTAIN) ||
                        player.getRole() === TeamRole.COCAPTAIN
                )
        ) {
            return APIResponse[403](
                `Player ${acepteeId} does not possess a valid Role to perform this action`
            );
        }

        // REVISIT - issues can occur here if one database method fails
        // delete join request
        const deleteResponse = await teamDatabase.removeJoinRequest(requesteeId, teamId);
        if (deleteResponse === false) {
            return APIResponse[404](
                `No join request found with player id: ${requesteeId} and team id: ${teamId}`
            );
        }

        // add player to team roster
        const response = await teamDatabase.addToTeamRoster(teamId, requesteeId, TeamRole.PLAYER);
        if (response === false) {
            return APIResponse[500](
                `Error joining team with player: ${requesteeId} and team: ${teamId}`
            );
        }

        return true;
    }
}
