import { AdminRole, AdminStatus, Language } from "../utilities/enums/userEnum";
import { User } from "./User";

export class Admin extends User {
    private role;

    private status;

    constructor(props: {
        authId: string;
        firstName: string;
        lastName: string;
        language: Language | null;
        emailAddress: string;
        role: AdminRole | null;
        dateCreated: Date | null;
        status: AdminStatus | null;
        // organizationId: string;
    }) {
        super(
            props.authId,
            props.firstName,
            props.lastName,
            props.language,
            props.emailAddress,
            props.dateCreated
            // props.status
            // props.organizationId
        );

        this.role = props.role;
        this.status = props.status;
    }

    getRole(): AdminRole | null {
        return this.role;
    }

    setRole(role: AdminRole): void {
        this.role = role;
    }

    getStatus(): AdminStatus | null {
        return this.status;
    }

    setStatus(status: AdminStatus | null) {
        this.status = status;
    }
}
