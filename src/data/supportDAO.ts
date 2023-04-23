import { fromDatabase, IAnnouncement, IAnnouncementDatabase } from "../interfaces/IAnnouncement";
// import { IFAQ } from "../interfaces/IFAQ";
import logger from "../utilities/winstonConfig";
import { withClient } from "./database";

/** This class performs DB functions using interfaces rather than objects
 * Just to see how it goes.
 */
export class SupportDAO {
    readonly className = this.constructor.name;

    /**
     * Creates announcement under organization with given id
     * @param announcement - must not be null
     * @param orgId - must not be null
     * @returns - the saved announcement
     */
    async createAnnouncement(announcement: IAnnouncement, orgId: string): Promise<IAnnouncement> {
        logger.verbose("Entering method createAnnouncement()", {
            class: this.className,
            values: { announcement, orgId },
        });

        const sql = `INSERT INTO announcement (title, description, organization_id) 
        VALUES($1, $2, $3)`;

        return withClient(async (querier) => {
            const [announce] = (
                await querier<IAnnouncementDatabase>(sql, [
                    announcement.title,
                    announcement.description,
                    orgId,
                ])
            ).rows;

            if (!announce) {
                logger.error("Error creating announcement", {
                    class: this.className,
                });
                throw new Error("Error creating announcement");
            }

            return fromDatabase(announce);
        });
    }

    /**
     * Returns all instances of announcement with given organization id
     * @param orgId - must not be null
     * @returns - announcement list with the given id
     */
    async findOrgAnnouncementsById(orgId: string): Promise<IAnnouncement[]> {
        logger.verbose("Entering method findAllOrgAnnouncementsById()", {
            class: this.className,
            values: { orgId },
        });

        const sql = `SELECT * FROM announcement 
        WHERE organization_id = $1`;

        return withClient(async (querier) => {
            const announcements = (await querier<IAnnouncementDatabase>(sql, [orgId])).rows;

            return announcements.map((announcement) => fromDatabase(announcement));
        });
    }

    /**
     * Returns all instances of announcement with organization id AND global
     * @param orgId - must not be null
     * @returns - announcement list with the given id
     */
    async findAllAnnouncementsById(orgId: string): Promise<IAnnouncement[]> {
        logger.verbose("Entering method findAllAnnouncementsById()", {
            class: this.className,
            values: { orgId },
        });

        const sql = `SELECT * FROM announcement 
        WHERE organization_id is null OR organization_id = $1`;

        return withClient(async (querier) => {
            const announcements = (await querier<IAnnouncementDatabase>(sql, [orgId])).rows;

            return announcements.map((announcement) => fromDatabase(announcement));
        });
    }

    /**
     * Returns all instances of global announcements
     * @returns - announcement list
     */
    async findAllGlobalAnnouncements(): Promise<IAnnouncement[]> {
        logger.verbose("Entering method findAllGlobalAnnouncements()", {
            class: this.className,
        });

        const sql = `SELECT * FROM announcement 
        WHERE organization_id is null`;

        return withClient(async (querier) => {
            const announcements = (await querier<IAnnouncementDatabase>(sql)).rows;

            return announcements.map((announcement) => fromDatabase(announcement));
        });
    }

    // async createFAQ(faq: IFAQ): Promise<IFAQ> {}

    // FEATURE: add expiration date to announcement
    // patchAnnouncement
    // deleteAnnouncement
}
