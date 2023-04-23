import OrganizationDAO from "../../data/organizationDAO";
import PlayerDAO from "../../data/playerDAO";
import TeamDAO from "../../data/teamDAO";
import { ITeamRoster } from "../../interfaces/ITeam";
import { IJoinRequest } from "../../interfaces/ITeamJoinRequest";
import { APIResponse } from "../../models/APIResponse";
import { Team } from "../../models/Team";
import { TeamRole } from "../../utilities/enums/teamEnum";
import logger from "../../utilities/winstonConfig";

const teamDatabase = new TeamDAO();
const organizationDatabase = new OrganizationDAO();
const playerDatabase = new PlayerDAO();

export class TeamBusinessService {
    // classname for logger
    private readonly className = this.constructor.name;

    /**
     * Finds all teams in application
     * @returns - team list
     */
    async findAllTeams(): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method createOrganizationWithAuth0Account()", {
            class: this.className,
        });

        return teamDatabase.findAllTeams();
    }

    /**
     * Returns all teams under organization regardless of status.
     * @param orgId
     * @returns
     */
    // TODO: add query parameters for status
    async findAllTeamsByOrganizationId(orgId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findAllTeamsByOrganizationId()", {
            class: this.className,
            values: { orgId },
        });

        // does organization exist
        const org = await organizationDatabase.findOrganizationById(orgId);
        if (!org) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        return teamDatabase.findAllTeamsByOrganizationId(orgId);
    }

    /**
     * Finds team using id
     * @param teamId - id to search with
     * @returns - error response or team with given id
     */
    async findTeamById(teamId: number): Promise<APIResponse | Team> {
        logger.verbose("Entering method findTeamById()", {
            class: this.className,
            values: { teamId },
        });

        // search for team
        const team = await teamDatabase.findTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        return team;
    }

    /**
     * Remove team by id
     * @param teamId - id to remove by
     * @returns - void
     */
    async removeTeamById(teamId: number): Promise<void> {
        logger.verbose("Entering method removeTeamById()", {
            class: this.className,
            values: { teamId },
        });

        return teamDatabase.removeTeamById(teamId);
    }

    /**
     * Removes player from team roster using given ids
     * @param teamId - team to remove from
     * @param playerId - player to remove from roster
     * @returns - error response or void
     */
    async removePlayerFromTeamRoster(
        teamId: number,
        playerId: string
    ): Promise<APIResponse | void> {
        logger.verbose("Entering method removePlayerFromTeamRoster()", {
            class: this.className,
            values: { teamId, playerId },
        });

        // does team exist
        const team = await teamDatabase.findTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // search for player on roster
        const player = team.getPlayers().find((player) => player.getAuthId() === playerId);

        // is player team captain
        if (player && player.getRole() === TeamRole.CAPTAIN) {
            return APIResponse.Conflict(`Cannot remove team Captain`);
        }

        // remove player from roster
        return teamDatabase.removeFromTeamRoster(teamId, playerId);
    }

    /**
     * Adds player to team roster
     * @param teamId - team to add player to
     * @param playerId - player to be added
     * @param role - role associated with player
     * @returns - error response or roster record
     */
    async addPlayerToTeamRoster(
        teamId: number,
        playerId: string,
        role?: TeamRole
    ): Promise<APIResponse | ITeamRoster> {
        logger.verbose("Entering method addPlayerToTeamRoster()", {
            class: this.className,
            values: { teamId, playerId, role },
        });

        // prevent multiple captains.
        if (role === TeamRole.CAPTAIN) {
            return APIResponse.BadRequest(`Team cannot have more than one Captain`);
        }

        const team = await teamDatabase.findTeamById(teamId);
        // does team exist
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // is team full
        if (team.getPlayers().length >= team.getMaxTeamSize()) {
            return APIResponse.Conflict(`Team is full`);
        }

        // is player on team already
        if (team.getPlayers().some((player) => player.getAuthId() === playerId)) {
            return APIResponse.Conflict(`Player ${playerId} is already on team`);
        }

        // does player id exist
        const player = await playerDatabase.findPlayerById(playerId);
        if (!player) {
            return APIResponse.NotFound(`No player found with id: ${playerId}`);
        }

        // add to team roster
        return teamDatabase.addToTeamRoster(teamId, playerId, role ?? TeamRole.PLAYER);
    }

    /**
     * Updates player role on team roster
     * @param teamId - team to update
     * @param playerId - player to be updated
     * @param role - new role
     * @returns - error response or roster record
     */
    async updatePlayerOnTeamRoster(
        teamId: number,
        playerId: string,
        role: TeamRole
    ): Promise<APIResponse | ITeamRoster> {
        logger.verbose("Entering method updatePlayerOnTeamRoster()", {
            class: this.className,
            values: { teamId, playerId, role },
        });

        // prevent multiple captains.
        if (role === TeamRole.CAPTAIN) {
            return APIResponse.BadRequest(`Team cannot have more than one Captain`);
        }

        // does team exist
        const team = await teamDatabase.findTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        const player = team.getPlayers().find((player) => player.getAuthId() === playerId);

        // is player on roster
        if (!player) {
            return APIResponse.NotFound(`No player found on team roster with id: ${playerId}`);
        }

        // is player a captain
        if (player.getRole() === TeamRole.CAPTAIN) {
            return APIResponse.BadRequest("Cannot change Captain's role");
        }

        // update roster
        return teamDatabase.updateTeamRoster(teamId, playerId, role);
    }

    /**
     * Creates join request for team
     * @param teamId - team recieving request
     * @param playerId - player requesting to join team
     * @param expirationDate - expirationDate of request; OPTIONAL
     * @returns - error response or join request record
     */
    async createTeamJoinRequest(
        teamId: number,
        playerId: string,
        expirationDate?: Date
    ): Promise<APIResponse | IJoinRequest> {
        logger.verbose("Entering method createTeamJoinRequest()", {
            class: this.className,
            values: { teamId, playerId, expirationDate },
        });

        // fetch team with id
        const team = await teamDatabase.findTeamById(teamId);

        // does team exist
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // is team full
        if (team.getPlayers().length > team.getMaxTeamSize()) {
            return APIResponse.Conflict(`Team is full`);
        }

        // if player is already on team
        if (team.getPlayers().find((player) => player.getAuthId() === playerId)) {
            return APIResponse.Conflict(`Player: ${playerId} is already on team`);
        }

        // expiration date of invite is set one week out if 'expirationDate' is ever undefined
        const date = new Date();
        date.setDate(date.getDate() + 7);

        // check if player has already sent invite
        const teamRequests = await teamDatabase.findAllJoinRequests(teamId);

        // if request already exists it is refreshed in the database
        if (teamRequests.find((request) => request.authId === playerId)) {
            return teamDatabase.updateJoinRequest(playerId, teamId, expirationDate ?? date);
        }

        // otherwise creates new request
        return teamDatabase.createJoinRequest(teamId, playerId, expirationDate ?? date);
    }
}
