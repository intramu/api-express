import { Team } from "../models/Team";
import logger from "../utilities/winstonConfig";
import { withClient } from "./database";

export default class teamDAO
{
    readonly className = this.constructor.name;
    
    /**
     * Finds a list of all details of a team within an Organization 
     * @param id string of the Organization
     * @returns List of Teams
     */
    async findAllTeamsByOrganizationId(id: string): Promise<Team[]> {
        logger.verbose("Entering method findAllTeamsByOrganizationId()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM team WHERE organization_id=$1";

        return withClient(async (querier) => {
            const response = await querier<Team>(sqlAll, [id]);

            const results = response.rows

            logger.verbose("Result", {
                class: this.className,
                values: results
            })
            return results
        })
    }

    async findAllTeamsByPlayerId(id: string): Promise<Team[]>{
        logger.verbose("Entering method findAllTeamsByOrganizationId()", {
            class: this.className,
        });

        const sqlAll = "SELECT team.ID as team_ID, team.NAME, team.WINS, team.TIES, team.LOSSES, team.IMAGE, team.VISIBILITY, team.SPORT, team.DATE_CREATED, team.MAX_TEAM_SIZE, tr.ROLE, tr.player_AUTH_ID, player.FIRST_NAME, player.LAST_NAME, player.GENDER FROM team team JOIN team_roster tr on(team.ID = tr.team_ID) JOIN player player on(tr.player_AUTH_ID = player.AUTH_ID) WHERE tr.team_ID IN (SELECT team_ID FROM team_roster WHERE player_AUTH_ID = ?) ORDER BY tr.team_ID ASC";

        return withClient(async (querier) => {
            const response = await querier<Team>(sqlAll, [id]);

            const results = response.rows
            
            console.log(results);
            
            // logger.verbose("Result", {
            //     class: this.className,
            //     values: results
            // })
            return results
        })
    }

    async 
}

const test = new teamDAO()
test.findAllTeamsByPlayerId()
