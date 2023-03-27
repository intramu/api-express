import { fromDatabase, IAnnouncement, IAnnouncementDatabase } from "../interfaces/IAnnouncement";
import { IFAQ } from "../interfaces/IFAQ";
import logger from "../utilities/winstonConfig";
import { withClient } from "./database";

/** This class performs DB functions using interfaces rather than objects
 * Just to see how it goes.
 */
export class SupportDAO {
    readonly className = this.constructor.name;

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

            return fromDatabase(announce);
        });
    }

    async findAllOrganizationAnnouncements(orgId: string): Promise<IAnnouncement[]> {
        logger.verbose("Entering method findOrganizationAnnouncements()", {
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

    async findAllGlobalAndOrganizationAnnouncements(orgId: string): Promise<IAnnouncement[]> {
        logger.verbose("Entering method findAllGlobalAndOrganizationAnnouncements()", {
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

    async findGlobalAnnouncements(): Promise<IAnnouncement> {
        logger.verbose("Entering method findAllGlobalAndOrganizationAnnouncements()", {
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

    async createFAQ(faq: IFAQ): Promise<IFAQ> {}

    // FEATURE: add expiration date to announcement
    // patchAnnouncement
    // deleteAnnouncement
}
