import { AdminRole, AdminStatus, Language } from "../utilities/enums/userEnum";
import { User } from "./User";

interface IAdminProps {
    authId: string;
    firstName: string;
    lastName: string;
    language: Language | null;
    emailAddress: string;
    role: AdminRole | null;
    dateCreated: Date | null;
    status: AdminStatus | null;
}

export class Admin extends User {
    private role: AdminRole | null;

    private status: AdminStatus | null;

    constructor(props: Partial<IAdminProps>) {
        const {
            authId = "",
            firstName = "",
            lastName = "",
            language = null,
            emailAddress = "",
            role = null,
            dateCreated = null,
            status = null,
        } = props;

        super(
            authId,
            firstName,
            lastName,
            language,
            emailAddress,
            dateCreated
            // props.organizationId
        );

        this.role = role;
        this.status = status;
    }

    public static fromDatabase(props: {
        auth_id: string;
        first_name: string;
        last_name: string;
        language: Language | null;
        email_address: string;
        role: AdminRole | null;
        date_created: Date | null;
        status: AdminStatus | null;
    }) {
        const obj = new Admin(props);
        obj.authId = props.auth_id;
        obj.firstName = props.first_name;
        obj.lastName = props.last_name;
        obj.emailAddress = props.email_address;
        obj.dateCreated = props.date_created;
        return obj;
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
