import { User } from "./User";

export class Admin extends User {
    // eslint-disable-next-line no-useless-constructor
    constructor(
        authId: string,
        firstName: string,
        lastName: string,
        language: string,
        emailAddress: string,
        role: string,
        dateCreated: Date,
        status: string,
        organizationId: string
    ) {
        super(authId, firstName, lastName, language, emailAddress, role, dateCreated, status, organizationId);
    }
}
