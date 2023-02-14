import PlayerDAO from "../../data/playerDAO";
import { APIResponse } from "../../models/APIResponse";
import { Player } from "../../models/Player";
import logger from "../../utilities/winstonConfig";

const playerDatabase = new PlayerDAO();

export class PlayerBusinessService {
    private readonly className = this.constructor.name;

    async findAllPlayers(): Promise<APIResponse | Player[]> {
        logger.verbose("Entering method findAllPlayers()", {
            class: this.className,
        });

        const players = await playerDatabase.findAllPlayers();
        if (players.length === 0) {
            return APIResponse[404](`No players found`);
        }

        return players;
    }

    async findPlayerById(playerId: string): Promise<APIResponse | Player> {
        logger.verbose("Entering method findPlayerById()", {
            class: this.className,
            values: playerId,
        });

        const player = await playerDatabase.findPlayerById(playerId);
        if (player === null) {
            return APIResponse[404](`No player found with id: ${playerId}`);
        }

        return player;
    }
}
