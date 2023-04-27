import { Location } from "../models/Location";
import logger from "../utilities/winstonConfig";
import { withClient } from "./database";

/** Location database methods */
export class LocationDAO {
    readonly className = this.constructor.name;

    /**
     * Returns all instances of location with given organization id
     * @param orgId - must not be null
     * @returns - location list with the given id
     */
    async findAllLocationsByOrganizationId(orgId: string): Promise<Location[]> {
        logger.verbose("Entering method findAllLocationsByOrganizationId()", {
            class: this.className,
            values: { orgId },
        });

        const sql = "SELECT * FROM location WHERE organization_id = $1";

        return withClient(async (querier) => {
            const response = (await querier<ILocationDatabase>(sql, [orgId])).rows;
            return response.map((location) => Location.fromDatabase(location));
        });
    }

    /**
     * Creates location under organization with given id
     * @param location - must not be null
     * @param orgId - id of organization; must not be null
     * @returns - the saved Location
     * @throws - if error when creating location
     */
    async createNewLocation(location: Location, orgId: string): Promise<Location> {
        logger.verbose("Entering method createNewLocation()", {
            class: this.className,
            values: { location, orgId },
        });

        const sql =
            "INSERT INTO location (address, city, state, zip_code, name, details, ismain) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";

        return withClient(async (querier) => {
            const [response] = (await querier<ILocationDatabase>(sql, [orgId])).rows;

            if (!response) {
                logger.error("Error creating location", {
                    class: this.className,
                });
                throw new Error("Error creating location");
            }
            return Location.fromDatabase(response);
        });
    }
}
