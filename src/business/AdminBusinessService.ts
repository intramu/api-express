import AdminDAO from "../data/adminDAO";
import PlayerDAO from "../data/playerDAO";
import TeamDAO from "../data/teamDAO";
import { Admin } from "../models/Admin";
import { APIResponse } from "../models/APIResponse";
import { Organization } from "../models/Organization";
import { Team } from "../models/Team";
import { Role, Visibility } from "../utilities/enums";
import logger from "../utilities/winstonConfig";

// const adminData = new AdminDAO();
const playerDatabase = new PlayerDAO();
const teamDatabase = new TeamDAO();

export class AdminBusinessService {
    readonly className = this.constructor.name;

    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async addPlayerToTeam(
        playerId: string,
        teamId: number,
        role: Role
    ): Promise<APIResponse | boolean> {
        logger.verbose("Entering method addPlayerToTeam()", {
            class: this.className,
        });

        const playerList = await playerDatabase.findPlayersByTeamId(teamId);
        const team = await teamDatabase.findTeamById(teamId);

        console.log("playerList: ", playerList);
        console.log("team:", team);

        if (team === null) {
            return new APIResponse(404, "Not Found", `No team found with id: ${teamId}`);
        }
        if (playerList === null || !playerList.length) {
            return new APIResponse(404, "Not Found", `No team found with id: ${teamId}`);
        }
        if (playerList.length >= team.getMaxTeamSize()!) {
            return new APIResponse(
                409,
                "Conflict",
                `Team is full. Max size: ${team.getMaxTeamSize()}`
            );
        }
        if (!!playerList.find((player) => player.getAuthId() === playerId)) {
            return new APIResponse(409, "Conflict", `Player ${playerId} is already on team`);
        }
        if (
            team.getVisibility() === Visibility.CLOSED ||
            team.getVisibility() === Visibility.PRIVATE
        ) {
            return new APIResponse(403, "Forbidden", `Team visibility: ${team.getVisibility()}`);
        }

        const responseAdd = await teamDatabase.addToTeamRoster(teamId, playerId, role);
        if (!responseAdd) {
            return new APIResponse(
                500,
                "Internal Server Error",
                "Server encountered error adding player"
            );
        }

        return true;
    }

    async 

    // async removePlayerFromTeam(playerId: string, teamId: number): Promise<APIResponse | boolean>{
    //     logger.verbose("Entering method removePlayerFromTeam()", {
    //         class: this.className,
    //     });

    // }

    // async createOrganization(org: Organization)
    // {
    //     const result = await adminData.createOrganization(org)

    //     if(result < 1){
    //         return({message: "Database Error", code: -1})
    //     }
    //     return({message: `Organization ${org.getName()} created`, code: 1})
    // }

    // async findAllOrganizations()
    // {
    //     const result = await adminData.findAllOrganizations();

    //     return({message: `${result.length} organizations found`, package: result, code: 1})
    // }

    // async findOrganizationById(id: string){
    //     const result = await adminData.findOrganizationById(id)

    //     return({message: 'One Organization found', package: result, code :1})
    // }

    // async deleteOrganizationById(id: string){
    //     const result = await adminData.deleteOrganizationById(id);

    //     return({message: `Organization deleted with id: ${id}`, code: 1})
    // }

    // async updateOrganization(org: Organization){
    //     const result = await adminData.updateOrganization(org);

    //     console.log(result);

    //     if(result === undefined){
    //         return({message: `No Organization found with id ${org.getId()}`, code: -2})
    //     }

    //     return ({message: `Organization ${org.getId()} updated`, code: 1})
    // }
}

const test = new AdminBusinessService();
testFunc();
async function testFunc() {
    console.log(await test.addPlayerToTeam("player2", 12, Role.CAPTAIN));
}
