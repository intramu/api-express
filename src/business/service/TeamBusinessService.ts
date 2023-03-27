import OrganizationDAO from "../../data/organizationDAO";
import PlayerDAO from "../../data/playerDAO";
import TeamDAO from "../../data/teamDAO";
import { APIResponse } from "../../models/APIResponse";
import { Team } from "../../models/Team";
import { TeamRole, TeamVisibility } from "../../utilities/enums/teamEnum";
import logger from "../../utilities/winstonConfig";

const teamDatabase = new TeamDAO();
const organizationDatabase = new OrganizationDAO();
const playerDatabase = new PlayerDAO();

export class TeamBusinessService {
    private readonly className = this.constructor.name;

    async findAllTeams(): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method createOrganizationWithAuth0Account()", {
            class: this.className,
        });

        const teams = await teamDatabase.findAllTeams();

        return teams;
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
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        const response = await teamDatabase.findAllTeamsByOrganizationId(orgId);
        if (response.length === 0) {
            return APIResponse.NotFound(`No teams found with organization id: ${orgId}`);
        }

        return response;
    }

    async findTeamById(teamId: number): Promise<APIResponse | Team> {
        logger.verbose("Entering method findTeamById()", {
            class: this.className,
            values: teamId,
        });

        const team = await teamDatabase.findTeamById(teamId);
        if (team === null) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        return team;
    }

    async removeTeamById(teamId: number): Promise<APIResponse | boolean> {
        logger.verbose("Entering method removeTeamById()", {
            class: this.className,
            values: teamId,
        });

        const team = await teamDatabase.removeTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        return true;
    }

    async removePlayerFromTeamRoster(
        teamId: number,
        playerId: string
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method removePlayerFromTeamRoster()", {
            class: this.className,
            values: { teamId, playerId },
        });

        // one player should always be on team, if no players were found, team doesn't exist
        const players = await teamDatabase.findAllPlayersByTeamId(teamId);
        if (players.length === 0) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // IS THERE A BETTER WAY TO DO THIS?
        const found = players.find((player) => player.getAuthId() === playerId);

        // is player on team
        if (found === undefined) {
            return APIResponse.NotFound(`No player on team roster with id: ${playerId}`);
        }

        // is player team captain
        if (found.getRole() === TeamRole.CAPTAIN) {
            return APIResponse.Conflict(`Cannot remove team Captain`);
        }

        await teamDatabase.removeFromTeamRoster(teamId, playerId);
        return true;
    }

    async addPlayerToTeamRoster(
        teamId: number,
        playerId: string,
        role?: TeamRole
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method addPlayerToTeamRoster()", {
            class: this.className,
            values: { teamId, playerId },
        });

        // IS THERE A BETTER WAY TO DO ALL THIS CHECKING
        // prevent multiple captains.
        if (role === TeamRole.CAPTAIN) {
            return APIResponse.BadRequest(`Team cannot have more than one Captain`);
        }

        const team = await teamDatabase.findTeamById(teamId);
        // does team exist
        if (team === null) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // is team public
        if (team.getVisibility() === TeamVisibility.PRIVATE) {
            return APIResponse.Forbidden(`Team visibility is Private`);
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
        if (player === null) {
            return APIResponse.NotFound(`No player found with id: ${playerId}`);
        }

        // add to team roster
        await teamDatabase.addToTeamRoster(teamId, playerId, role ?? TeamRole.PLAYER);

        return true;
    }

    async updatePlayerOnTeamRoster(
        teamId: number,
        playerId: string,
        role: TeamRole
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method updatePlayerOnTeamRoster()", {
            class: this.className,
            values: { teamId, playerId },
        });

        // prevent multiple captains.
        if (role === TeamRole.CAPTAIN) {
            return APIResponse.BadRequest(`Team cannot have more than one Captain`);
        }

        // does team exist
        const team = await teamDatabase.findTeamById(teamId);
        if (team === null) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        const found = team.getPlayers().find((player) => player.getAuthId() === playerId);

        // is player on roster
        if (found === undefined) {
            return APIResponse.NotFound(`No player found on team roster with id: ${playerId}`);
        }

        // is player a captain
        if (found.getRole() === TeamRole.CAPTAIN) {
            return APIResponse.BadRequest("Cannot change Captain's role");
        }

        // update roster
        const response = teamDatabase.updateTeamRoster(teamId, playerId, role ?? TeamRole.PLAYER);

        if (!response) {
            throw new Error("Error updating team roster");
        }

        return true;
    }

    async createTeamJoinRequest(
        teamId: number,
        playerId: string,
        expirationDate: Date
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method createTeamJoinRequest()", {
            class: this.className,
            values: { teamId, playerId },
        });

        // fetch team with id
        const team = await teamDatabase.findTeamById(teamId);

        // does team exist
        if (team === null) {
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

        // check if player has already sent invite
        const teamRequests = await teamDatabase.findAllJoinRequests(teamId);
        // TODO: refresh invite rather than a confliction
        if (teamRequests.find((request) => request.authId === playerId)) {
            return APIResponse.Conflict(`Invite already exists for player`);
        }

        await teamDatabase.createJoinRequest(teamId, playerId, expirationDate);
        return true;
    }
}
