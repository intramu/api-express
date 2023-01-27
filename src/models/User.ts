import { Language, Role, Status } from "../utilities/enums";

export abstract class User {
    protected id: string | null;

    protected firstName: string;

    protected lastName: string;

    protected language: Language | null;

    protected emailAddress: string;

    protected role: Role | null;

    protected dateCreated: Date | null;

    protected status: Status | null;

    protected organizationId: string | null;

    constructor(
        authId: string | null,
        firstName: string,
        lastName: string,
        language: Language | null,
        emailAddress: string,
        role: Role | null,
        dateCreated: Date | null,
        status: Status | null,
        organizationId: string | null
    ) {
        this.id = authId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.language = language;
        this.emailAddress = emailAddress;
        this.role = role;
        this.dateCreated = dateCreated;
        this.status = status;
        this.organizationId = organizationId;
    }

    getAuthId(): string | null {
        return this.id;
    }

    setAuthId(authId: string): void {
        this.id = authId;
    }

    getFirstName(): string {
        return this.firstName;
    }

    setFirstName(firstName: string): void {
        this.firstName = firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    setLastName(lastName: string): void {
        this.lastName = lastName;
    }

    getLanguage(): Language | null {
        return this.language;
    }

    setLanguage(language: Language | null): void {
        this.language = language;
    }

    getEmailAddress(): string {
        return this.emailAddress;
    }

    setEmailAddress(emailAddress: string): void {
        this.emailAddress = emailAddress;
    }

    getRole(): Role | null {
        return this.role;
    }

    setRole(role: Role | null): void {
        this.role = role;
    }

    getDateCreated(): Date | null {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    getStatus(): Status | null {
        return this.status;
    }

    setStatus(status: Status | null) {
        this.status = status;
    }

    getOrganizationId(): string | null {
        return this.organizationId;
    }

    setOrganizationId(organizationId: string): void {
        this.organizationId = organizationId;
    }

    // protected universityId!: number;
}
