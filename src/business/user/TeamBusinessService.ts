import ContestDAO from "../../data/contestDAO";
import OrganizationDAO from "../../data/organizationDAO";
import PlayerDAO from "../../data/playerDAO";
import TeamDAO from "../../data/teamDAO";
import { APIResponse } from "../../models/APIResponse";
import { Team } from "../../models/Team";
import { TeamRole, TeamStatus, TeamVisibility } from "../../utilities/enums/teamEnum";
import logger from "../../utilities/winstonConfig";

const playerDatabase = new PlayerDAO();
const teamDatabase = new TeamDAO();
const organizationDatabase = new OrganizationDAO();
const contestDatabase = new ContestDAO();

export class TeamBusinessService {
    readonly className = this.constructor.name;

    /**
     * Creates new team, player becomes captain
     *
     * @param team - team object passed to database
     * @param playerId - player that will be set as captain of the team
     * @returns - returns single team object with added details
     */
    async createTeam(team: Team, authorizingId: string): Promise<APIResponse | Team> {
        logger.verbose("Entering method createTeam()", {
            class: this.className,
            values: { team, authorizingId },
        });

        const organization = await organizationDatabase.findOrganizationByPlayerId(authorizingId);
        if (organization === null) {
            return APIResponse.NotFound(`No player found with id: ${authorizingId}`);
        }

        // find bracket team wants to join
        const contest = await contestDatabase.findPathByBracketId(team.getBracketId()!);
        if (!contest) {
            return APIResponse.NotFound(`No bracket found with id:${team.getBracketId()}`);
        }

        const newTeam: Team = team;
        newTeam.setSportsmanshipScore(4.0);
        newTeam.setStatus(TeamStatus.UNELIGIBLE);

        const division = contest.getLeagues()[0].getDivisions()[0];

        newTeam.setMaxTeamSize(division.getMaxTeamSize());
        newTeam.setGender(division.getType());
        newTeam.setBracketId(division.getBrackets()[0].getId());

        // when creating team player role is set to Captain
        const response = await teamDatabase.createTeam(
            newTeam,
            authorizingId,
            organization.getId(),
            TeamRole.CAPTAIN
        );

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
            return APIResponse.NotFound(`No teams found with id ${orgId}`);
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
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        const response = await teamDatabase.findAllTeamsByOrganizationId(orgId);
        if (response.length === 0) {
            return APIResponse.NotFound(`No teams found with organization id: ${orgId}`);
        }

        return response;
    }

    // TODO: create function to move team to bracket (will check if team meets minimum requirements)
    /**
     * Adds player to team as a player, only if the team is public
     * @param playerId - id of player to add to team
     * @param teamId - id of team, player is being added too
     * @returns Error Response
     * @returns boolean
     */
    async joinTeam(playerId: string, teamId: number): Promise<APIResponse | boolean> {
        logger.verbose("Entering method joinTeam()", {
            class: this.className,
            values: { playerId, teamId },
        });

        // TODO: move team to bracket if they meet bracket requirements

        const team = await teamDatabase.findTeamById(teamId);

        // does team exist
        if (team === null) {
            return APIResponse.NotFound(`No Team found with id: ${teamId}`);
        }

        // is team open
        if (team.getVisibility() !== TeamVisibility.PUBLIC) {
            return APIResponse.Forbidden(`Team visibility: ${team.getVisibility()}`);
        }

        // is team full
        if (team.getPlayers().length >= team.getMaxTeamSize()) {
            return APIResponse.Conflict(`Team is full. Max size: ${team.getMaxTeamSize()}`);
        }

        // is player already on team
        if (team.getPlayers().some((player) => player.getAuthId() === playerId)) {
            return APIResponse.Conflict(`Player ${playerId} is already on team`);
        }

        // if all checks out, add player to team
        teamDatabase.addToTeamRoster(teamId, playerId, TeamRole.PLAYER);
        return true;
    }

    /**
     * Kicks player from team roster. Authorizing id must come from captain or co-captain
     * on team roster.
     * @param kickeeId - id of player to be kicked from team
     * @param teamId - id of team player will be kicked from
     * @param authorizingId - id of captain or co-captain on team
     * @returns - error response or true for success
     */
    async kickPlayerFromTeam(
        kickeeId: string,
        teamId: number,
        authorizingId: string
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method kickPlayerFromTeam()", {
            class: this.className,
            values: { kickeeId, teamId, authorizingId },
        });

        // one player should always be on team, if no players were found, team doesn't exist
        const players = await teamDatabase.findAllPlayersByTeamId(teamId);
        if (players.length === 0) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // search for authorizing player
        const authorizing = players.find((player) => player.getAuthId() === authorizingId);

        // is authorizing id a captain or co-captain
        if (
            authorizing !== undefined &&
            authorizing.getRole() !== TeamRole.CAPTAIN &&
            authorizing.getRole() !== TeamRole.COCAPTAIN
        ) {
            return APIResponse.Forbidden(`Id: ${authorizingId} not authorized to remove players`);
        }

        // search for kickee
        const kickee = players.find((player) => player.getAuthId() === kickeeId);

        // if player to kick is on team
        if (kickee === undefined) {
            return APIResponse.NotFound(`Player: ${kickeeId} to kick not found`);
        }

        // if player to kick is captain
        if (kickee.getRole() === TeamRole.CAPTAIN) {
            return APIResponse.Conflict(`Cannot remove captain from team`);
        }

        // if all checks out player is removed from team roster
        await teamDatabase.removeFromTeamRoster(teamId, kickeeId);
        return true;
    }

    async updatePlayerRoleOnTeam(
        updateeId: string,
        teamId: number,
        authorizingId: string,
        role: TeamRole
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method kickPlayerFromTeam()", {
            class: this.className,
            values: { updateeId, teamId, authorizingId, role },
        });

        // prevent multiple captains
        if (role === TeamRole.CAPTAIN) {
            return APIResponse.BadRequest(`Team cannot have more than one Captain`);
        }

        // one player should always be on team, if no players were found, team doesn't exist
        const players = await teamDatabase.findAllPlayersByTeamId(teamId);
        if (players.length === 0) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // search for authorizing player
        const authorizing = players.find((player) => player.getAuthId() === authorizingId);
        if (
            authorizing !== undefined &&
            authorizing.getRole() !== TeamRole.CAPTAIN &&
            authorizing.getRole() !== TeamRole.COCAPTAIN
        ) {
            return APIResponse.Forbidden(`Id: ${authorizingId} not authorized to remove players`);
        }

        // search for updatee
        const kickee = players.find((player) => player.getAuthId() === updateeId);

        // if player to update is on team
        if (kickee === undefined) {
            return APIResponse.NotFound(`Player: ${updateeId} to kick not found`);
        }

        // if player to kick is captain
        if (kickee.getRole() === TeamRole.CAPTAIN) {
            return APIResponse.Conflict(`Cannot update Captain's role`);
        }

        await teamDatabase.updateTeamRoster(teamId, updateeId, role);
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

        const team = await teamDatabase.findTeamById(teamId);

        if (team === null) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
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
            return APIResponse.NotFound(`No team found with id: ${team.getId()}`);
        }

        const updatedTeam = await teamDatabase.patchTeam(team);

        if (updatedTeam === null) {
            return APIResponse.InternalError(`Error updating team: ${team.getId()}`);
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
        if (teamRequests.find((request) => request.authId === playerId)) {
            return APIResponse.Conflict(`Invite already exists for player`);
        }

        // expiration date of invite is set one week out
        const date = new Date();
        date.setDate(date.getDate() + 7);

        await teamDatabase.createJoinRequest(teamId, playerId, date);
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

        // TODO: move team to bracket if they meet bracket requirements

        // check if team exists
        const team = await teamDatabase.findTeamById(teamId);
        if (team === null) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
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
            return APIResponse.Forbidden(
                `Player ${acepteeId} does not possess a valid Role to perform this action`
            );
        }

        // REVISIT - issues can occur here if one database method fails
        // delete join request
        const deleteResponse = await teamDatabase.removeJoinRequest(requesteeId, teamId);
        if (deleteResponse === false) {
            return APIResponse.NotFound(
                `No join request found with player id: ${requesteeId} and team id: ${teamId}`
            );
        }

        // add player to team roster
        await teamDatabase.addToTeamRoster(teamId, requesteeId, TeamRole.PLAYER);

        return true;
    }
}
