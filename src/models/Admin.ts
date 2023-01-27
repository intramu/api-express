import { Language, Role, Status } from "../utilities/enums";
import { User } from "./User";

export class Admin extends User {
    // eslint-disable-next-line no-useless-constructor
    constructor(
        authId: string | null,
        firstName: string,
        lastName: string,
        language: Language | null,
        emailAddress: string,
        role: Role | null,
        dateCreated: Date | null,
        status: Status | null,
        organizationId: string
    ) {
        super(
            authId,
            firstName,
            lastName,
            language,
            emailAddress,
            role,
            dateCreated,
            status,
            organizationId
        );
    }
}
