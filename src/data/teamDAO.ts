import { APIResponse } from "../models/APIResponse";
import { Team } from "../models/Team";
import { Role, Status, Visibility } from "../utilities/enums";
import logger from "../utilities/winstonConfig";
import { withClient, withClientRollback } from "./database";

export default class TeamDAO
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

    async findAllTeams(): Promise<Team[]|null>{
        logger.verbose("Entering method findAllTeams()", {
            class: this.className,
        });

        const sqlAll = "SELECT * FROM team";

        return withClient(async (querier) => {
            const response = await querier<Team>(sqlAll)
            const results = response.rows

            console.log(results);

            return results;
        })
    }

    async findTeamById(teamId: number): Promise<Team | null>{
        logger.verbose("Entering method findTeamById()", {
            class: this.className,
        });

        const sqlFind = "SELECT * FROM team WHERE id = $1";
        
        return withClient(async (querier) => {
            const response = await querier(sqlFind, [teamId])
            const [results] = response.rows
            
            // console.log(results);

            if(results === undefined){
                return null
            }

            return new Team(results.id, results.name, results.wins, results.ties, results.losses, results.image, results.visibility, results.sport, results.date_created, results.sportsmanship_score, results.status, results.max_team_size, [], results.organization_id, null)
        })
    }

    async updateTeam(team: Team): Promise<Team | null>{
        logger.verbose("Entering method updateTeam()", {
            class: this.className,
            values: team
        });

        const sqlUpdate = "UPDATE team SET name=$1, wins=$2, ties=$3, losses=$4, image=$5, visibility=$6, sport=$7, sportsmanship_score=$8, status=$9, max_team_size=$10 WHERE id = $11 RETURNING *"

        return withClient(async (querier) => {
            const response = await querier(sqlUpdate, [
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
                team.getId()
            ])
            const [results] = response.rows
            
            if(results === undefined){
                return null
            }
            
            return new Team(results.id, results.name, results.wins, results.ties, results.losses, results.image, results.visibility, results.sport, results.date_created, results.sportsmanship_score, results.status, results.max_team_size, [], results.organization_id, null)            
        })
    }

    async createTeam(team: Team): Promise<Team | null>{
        logger.verbose("Entering method createTeam()", {
            class: this.className,
            values: team
        });

        const sqlAdd = "INSERT INTO team (name, wins, ties, losses, image, visibility, sport, sportsmanship_score, status, max_team_size, organization_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";

        return withClient(async (querier)=>{
            const response = await querier(sqlAdd, [
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
                team.getOrganizationId()
            ])

            const [results] = response.rows

            console.log(results);

            if(results === undefined){
                return null
            }

            return new Team(results.id, results.name, results.wins, results.ties, results.losses, results.image, results.visibility, results.sport, results.sportsmanship_score, results.status, results.max_team_size, results.date_created, [], results.organization_id, null);
        })

    }

    async addToTeamRoster(teamId: number, playerId: string, role: Role): Promise<boolean>{
        logger.verbose("Entering method addToTeamRoster()", {
            class: this.className,
        });

        const sqlAddPlayer = "INSERT INTO team_roster (player_AUTH_ID, team_ID, role) VALUES ($1, $2, $3)";
        
        return withClient(async (querier) => {
            const responseAdd = await querier(sqlAddPlayer, [
                playerId,
                teamId,
                role
            ])
            .catch((err) => null)
            
            if(responseAdd === null){
                return false;
            }

            return true;
        })
    }

    async removeFromTeamRoster(teamId: number, playerId: string): Promise<boolean>{
        logger.verbose("Entering method removeFromTeamRoster()", {
            class: this.className,
        });

        const sqlRemove = "DELETE FROM team_roster WHERE player_AUTH_ID=$1 AND team_ID=$2";
        
        return withClient(async (querier) => {
            const response = await querier(sqlRemove, [
                playerId,
                teamId
            ])
                .catch((err) => null)
            
            if(response === null){
                return false;
            }

            if(response.rowCount > 1){
                logger.error("removeFromTeamRoster deleted more than one record", {
                    class: this.className,
                    values:{
                        "playerId": playerId,
                        "teamId": teamId
                    }
                })
            }

            return true;
        })
    }
}

const test = new TeamDAO()
// test.findAllTeamsByPlayerId()
// test.findAllTeams();
// test.findTeamById(12)

const team = new Team(20, 'Hello Barbie', 0, 0, 0, null, Visibility.PUBLIC, 'Soccer', null, 4.0, Status.ACTIVE, 12, [], '7f83b6f4-754a-4f34-913d-907c1226321f', null)

testFunc()

async function testFunc(){
    // console.log(await test.addToTeamRoster(12, "player4", Role.PLAYER))    
    // console.log(await test.removeFromTeamRoster(12, "player2"));   
    // const newTeam = await test.updateTeam(team);
    const newTeam = await test.createTeam(team)
    console.log(newTeam?.getId());
    // console.log(await test.findTeamById(12));
    
}


