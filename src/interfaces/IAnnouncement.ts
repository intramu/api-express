export interface IAnnouncementDatabase {
    id: number;
    title: string;
    description: string;
    date_created: Date;
    organization_id: string;
}

export interface IAnnouncement {
    id: number;
    title: string;
    description: string;
    // the global flag specifies whether the announcement was from Intramu or the organization
    global: boolean;
    dateCreated: Date;
}

export const fromDatabase = (announcement: IAnnouncementDatabase): IAnnouncement => {
    const { id, description, title } = announcement;
    return {
        id,
        title,
        description,
        // Sets the global flag to true if the announcement contains a null organization_id
        global: !announcement.organization_id,
        dateCreated: announcement.date_created,
    };
};
