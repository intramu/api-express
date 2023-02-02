import { Language, Role, Status } from "../utilities/enums";
import { User } from "./User";

export class Admin extends User {
    // eslint-disable-next-line no-useless-constructor
    constructor(props: {
        authId: string | null;
        firstName: string;
        lastName: string;
        language: Language | null;
        emailAddress: string;
        role: Role | null;
        dateCreated: Date | null;
        status: Status | null;
        organizationId: string;
    }) {
        super(
            props.authId,
            props.firstName,
            props.lastName,
            props.language,
            props.emailAddress,
            props.role,
            props.dateCreated,
            props.status,
            props.organizationId
        );
    }
}
