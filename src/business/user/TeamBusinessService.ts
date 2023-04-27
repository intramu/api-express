import ContestDAO from "../../data/contestDAO";
import OrganizationDAO from "../../data/organizationDAO";
import PlayerDAO from "../../data/playerDAO";
import TeamDAO from "../../data/teamDAO";
import { APIResponse } from "../../models/APIResponse";
import { Team } from "../../models/Team";
import { TeamRole, TeamStatus, TeamVisibility } from "../../utilities/enums/teamEnum";
import logger from "../../utilities/winstonConfig";
import { IJoinRequest } from "../../interfaces/ITeamJoinRequest";

const playerDatabase = new PlayerDAO();
const teamDatabase = new TeamDAO();
const organizationDatabase = new OrganizationDAO();
const contestDatabase = new ContestDAO();

export class TeamBusinessService {
    readonly className = this.constructor.name;

    /**
     * Returns all contest games for a team id
     * @param authId - player searching
     * @param teamId - team be searched on
     * @returns - error response or team list
     */
    async findContestGamesById(authId: string, teamId: number) {
        logger.verbose("Entering method findContestGamesById()", {
            class: this.className,
            values: { authId, teamId },
        });

        const playerOrg = await organizationDatabase.findOrganizationByPlayerId(authId);
        const teamOrg = await organizationDatabase.findOrganizationByTeamId(teamId);

        // does player organization and team organization exist
        if (!playerOrg || !teamOrg) {
            return APIResponse.NewNotFound(teamId.toString());
        }

        // are team and player in same organization
        if (playerOrg.getId() !== teamOrg.getId()) {
            return APIResponse.NewNotFound(teamId.toString());
        }

        // return all contest games for team
        return teamDatabase.findAllContestGames(teamId);
    }

    /**
     * Creates new team, player becomes captain
     * @param team - team object passed to database
     * @param divisionId - division waitlist to place team in
     * @param playerId - player that will be set as captain of the team
     * @returns - error response or the saved team
     */
    async createTeam(
        team: Team,
        divisionId: number,
        authorizingId: string
    ): Promise<APIResponse | Team> {
        logger.verbose("Entering method createTeam()", {
            class: this.className,
            values: { team, authorizingId },
        });

        // does player exist
        const organization = await organizationDatabase.findOrganizationByPlayerId(authorizingId);
        if (!organization) {
            return APIResponse.NotFound(`No player found with id: ${authorizingId}`);
        }

        // find division team wants to join since they can't directly join bracket until
        // meeting minimum requirements
        const division = await contestDatabase.findDivisionById(divisionId);
        if (!division) {
            return APIResponse.NotFound(`No division found with id: ${divisionId}`);
        }

        // search for waitlist bracket in division
        const waitlist = division.getBrackets().find((bracket) => bracket.getMaxTeamAmount() === 0);

        // if it doesn't exist this is a big error
        if (!waitlist) {
            logger.error(`No waitlist for division: ${divisionId}`, {
                class: this.className,
            });
            throw new Error("No waitlist found");
        }

        const newTeam = new Team({
            ...team,
            //setting some default team values
            sportsmanshipScore: 4.0,
            status: TeamStatus.FINISHED,
            maxTeamSize: division.getMaxTeamSize(),
            gender: division.getType()!,
            // put the team into the waitlist bracket
            bracketId: waitlist.getId(),
        });

        // create team
        return teamDatabase.createTeam(newTeam, authorizingId, organization.getId());
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

        // finds all teams in organization
        const response = await teamDatabase.findAllTeamsByOrganizationId(orgId);

        // filters team for eligibility
        const teamList = response.filter(
            (team) =>
                team.getStatus() === TeamStatus.ELIGIBLE ||
                team.getStatus() === TeamStatus.UNELIGIBLE
        );

        return teamList;
    }

    /**
     * Returns all teams under organization regardless of status.
     * @param orgId - organization to search under
     * @returns - error response or team list
     */
    // TODO: add query parameters
    async findAllTeamsByOrganizationId(orgId: string): Promise<APIResponse | Team[]> {
        logger.verbose("Entering method findAllTeamsByOrganizationId()", {
            class: this.className,
            values: orgId,
        });

        const org = await organizationDatabase.findOrganizationById(orgId);
        if (!org) {
            return APIResponse.NotFound(`No organization found with id: ${orgId}`);
        }

        return teamDatabase.findAllTeamsByOrganizationId(orgId);
    }

    // TODO: create function to move team to bracket (will check if team meets minimum requirements)
    /**
     * Adds player to team as a player, only if the team is public
     * @param playerId - id of player to add to team
     * @param teamId - id of team, player is being added too
     * @returns error Response or void
     */
    // TODO: not separation safe. are player and team in same organization
    async joinTeam(playerId: string, teamId: number): Promise<APIResponse | void> {
        logger.verbose("Entering method joinTeam()", {
            class: this.className,
            values: { playerId, teamId },
        });

        // TODO: move team to bracket if they meet bracket requirements

        const team = await teamDatabase.findTeamById(teamId);

        // does team exist
        if (!team) {
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
        await teamDatabase.addToTeamRoster(teamId, playerId, TeamRole.PLAYER);
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
    ): Promise<APIResponse | void> {
        logger.verbose("Entering method kickPlayerFromTeam()", {
            class: this.className,
            values: { kickeeId, teamId, authorizingId },
        });

        // one player should always be on team, if no players were found, team doesn't exist
        const team = await teamDatabase.findTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // search for authorizing player
        const authorizing = team
            .getPlayers()
            .find((player) => player.getAuthId() === authorizingId);

        // is authorizing id a captain or co-captain
        if (
            authorizing &&
            authorizing.getRole() !== TeamRole.CAPTAIN &&
            authorizing.getRole() !== TeamRole.COCAPTAIN
        ) {
            return APIResponse.Forbidden(`Id: ${authorizingId} not authorized to remove players`);
        }

        // search for kickee
        const kickee = team.getPlayers().find((player) => player.getAuthId() === kickeeId);

        // if player to kick is on team
        if (!kickee) {
            return APIResponse.NotFound(`Player: ${kickeeId} to kick not found`);
        }

        // if player to kick is captain
        if (kickee.getRole() === TeamRole.CAPTAIN) {
            return APIResponse.Conflict(`Cannot remove captain from team`);
        }

        // if all checks out player is removed from team roster
        await teamDatabase.removeFromTeamRoster(teamId, kickeeId);
    }

    async updatePlayerRoleOnTeam(
        updateeId: string,
        teamId: number,
        authorizingId: string,
        role: TeamRole
    ): Promise<APIResponse | void> {
        logger.verbose("Entering method kickPlayerFromTeam()", {
            class: this.className,
            values: { updateeId, teamId, authorizingId, role },
        });

        // prevent multiple captains
        if (role === TeamRole.CAPTAIN) {
            return APIResponse.BadRequest(`Team cannot have more than one Captain`);
        }

        // one player should always be on team, if no players were found, team doesn't exist
        const team = await teamDatabase.findTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // search for authorizing player
        const authorizing = team
            .getPlayers()
            .find((player) => player.getAuthId() === authorizingId);
        if (
            authorizing &&
            authorizing.getRole() !== TeamRole.CAPTAIN &&
            authorizing.getRole() !== TeamRole.COCAPTAIN
        ) {
            return APIResponse.Forbidden(`Id: ${authorizingId} not authorized to remove players`);
        }

        // search for updatee
        const kickee = team.getPlayers().find((player) => player.getAuthId() === updateeId);

        // if player to update is on team
        if (!kickee) {
            return APIResponse.NotFound(`Player: ${updateeId} to kick not found`);
        }

        // if player to kick is captain
        if (kickee.getRole() === TeamRole.CAPTAIN) {
            return APIResponse.Conflict(`Cannot update Captain's role`);
        }

        // update player on roster
        await teamDatabase.updateTeamRoster(teamId, updateeId, role);
    }

    /**
     * Returns details on team by searching with id
     * @param teamId - id of team to search with
     * @returns - error response or team with given id
     */
    // TODO: is requesting player in organization
    async findTeamById(teamId: number, authId: string): Promise<APIResponse | Team> {
        logger.verbose("Entering method findTeamById()", {
            class: this.className,
            values: { teamId, authId },
        });

        // does team exist
        const team = await teamDatabase.findTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        return team;
    }

    /**
     * Patches team details with id that exists on team object. This method only patches
     * object in database
     * @param team - new team details
     * @returns - error response or patched team
     */
    // TODO: is requesting player a captain
    async patchTeam(authId: string, team: Team): Promise<APIResponse | Team> {
        logger.verbose("Entering method patchTeam()", {
            class: this.className,
        });

        // does team exist
        const teamResult = await teamDatabase.findTeamById(team.getId()!);
        if (!teamResult) {
            return APIResponse.NotFound(`No team found with id: ${team.getId()}`);
        }

        // is player on team and the captain
        if (
            !team
                .getPlayers()
                .some(
                    (player) =>
                        player.getAuthId() === authId && player.getRole() === TeamRole.CAPTAIN
                )
        ) {
            return APIResponse.Forbidden(`${authId} is not authorized to patch the team`);
        }

        // patches team in database
        return teamDatabase.patchTeam(team);
    }

    /**
     * Makes request for a player to join a team
     * @param playerId - id of player wanting to join team
     * @param teamId - id of team
     * @returns - error response or void
     */
    async requestToJoinTeam(playerId: string, teamId: number): Promise<APIResponse | void> {
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

        // expiration date of invite is set one week out
        const date = new Date();
        date.setDate(date.getDate() + 7);

        // check if player has already sent invite
        const teamRequests = await teamDatabase.findAllJoinRequests(teamId);
        if (teamRequests.find((request) => request.authId === playerId)) {
            // refreshes invite if one already exists
            teamDatabase.updateJoinRequest(playerId, teamId, date);
            return;
        }

        await teamDatabase.createJoinRequest(teamId, playerId, date);
    }

    async findAllJoinRequests(
        teamId: number,
        authorizingId: string
    ): Promise<APIResponse | IJoinRequest[]> {
        logger.verbose("Entering method findAllJoinRequests()", {
            class: this.className,
            values: { teamId, authorizingId },
        });

        // does team exist
        const team = await teamDatabase.findTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }

        // does authorizingId match anyone on team
        if (
            !team
                .getPlayers()
                .some(
                    (player) =>
                        (player.getAuthId() === authorizingId &&
                            player.getRole() === TeamRole.CAPTAIN) ||
                        player.getRole() === TeamRole.COCAPTAIN
                )
        ) {
            return APIResponse.Forbidden(
                `Player ${authorizingId} does not possess a valid Role to perform this action`
            );
        }

        // finds all join requests
        return teamDatabase.findAllJoinRequests(teamId);
    }

    /**
     * Accepts invite that a player sent to join a team
     * @param requesteeId - id of player wanting to join team
     * @param authorizingId - id of captain or co-captain accepting invite
     * @param teamId - id of team player is joining.
     * @returns - error response or true if success
     */
    async acceptJoinRequest(
        requesteeId: string,
        authorizingId: string,
        teamId: number
    ): Promise<APIResponse | void> {
        logger.verbose("Entering method acceptJoinRequest()", {
            class: this.className,
            values: {
                requesteeId,
                authorizingId,
                teamId,
            },
        });

        // TODO: move team to bracket if they meet bracket requirements

        // check if team exists
        const team = await teamDatabase.findTeamById(teamId);
        if (!team) {
            return APIResponse.NotFound(`No team found with id: ${teamId}`);
        }
        // check that aceptee id possesses valid rights to accept join request
        if (
            !team
                .getPlayers()
                .some(
                    (player) =>
                        player.getAuthId() === authorizingId &&
                        (player.getRole() === TeamRole.CAPTAIN ||
                            player.getRole() === TeamRole.COCAPTAIN)
                )
        ) {
            return APIResponse.Forbidden(
                `Player ${authorizingId} does not possess a valid Role to perform this action`
            );
        }

        // REVISIT - issues can occur here if one database method fails
        // delete join request
        await teamDatabase.removeJoinRequest(requesteeId, teamId);

        // add player to team roster
        await teamDatabase.addToTeamRoster(teamId, requesteeId, TeamRole.PLAYER);
    }
}
