import { Team } from "../models/Team";
import logger from "../utilities/winstonConfig";

const db = require("./database.js")

// todo: Return types?
export default class playerDAO{
    className = this.constructor.name;

    async findAllTeams(){
        logger.verbose('Entering method findAllTeams()', {
            class: this.className,
        });
        
        let client = null;
        
        const sqlAll = 'SELECT * FROM team';
        try {
            client = await db.connect()
            let response = await client.query(sqlAll)
            console.log(response);
            //return results
        } catch (error:any) {
            logger.error('Database Connection / Query Error', {
                type: error,
                class: this.className,
            });
            return null;
        } finally{
            client?.release()
        }
    }

    async findAllTeamsByOrganizationId(){}

    async findAllTeamsByPlayerId(){}

    async createTeam(team: Team){
        logger.verbose('Entering method createTeam()', {
            class: this.className,
        });
        
        let client = null;
        
        const sqlCreate = 'INSERT INTO team (name, wins, ties, losses, image, visibility, sport, sportsmanship_score, status, max_team_size, women_count, men_count, organization_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id';

        try {
            client = await db.connect()
            let response = await client.query(sqlCreate, [
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
                team.getWomenCount(),
                team.getMenCount(),
                team.getOrganizationId()
            ])
            console.log(response);
            //return results
        } catch (error:any) {
            logger.error('Database Connection / Query Error', {
                type: error,
                class: this.className,
            });
            return null;
        } finally{
            client?.release()
        }
    }
}

let test = new playerDAO();

let team = new Team(0, "Team Anderson", null, 0, 0, null , '', "SOCCER", null, 0, '', null, 0, 0, null, "400b6127-f737-41ee-8022-2aeba11a96a8")
test.createTeam(team)