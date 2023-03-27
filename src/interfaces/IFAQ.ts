export interface IFAQ {
    id: number;
    question: string;
    answer: string;
    global: boolean;
    dateCreated: Date;
}

export interface IFAQDatabase {
    id: number;
    question: string;
    answer: string;
    date_created: Date;
    organization_id: string;
}

export const fromDatabase = (faq: IFAQDatabase): IFAQ => {
    const { id, question, answer } = faq;
    return {
        id,
        question,
        answer,
        // Sets the global flag to true if the faq contains a null organization_id
        global: !faq.organization_id,
        dateCreated: faq.date_created,
    };
};
