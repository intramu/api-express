import { Role, Status } from "../utilities/enums";

export abstract class User {
    protected id: string | null;

    protected firstName: string;

    protected lastName: string;

    protected language: string;

    protected emailAddress: string;

    protected role: Role | null

    protected dateCreated: Date;

    protected status: Status;

    protected organizationId: string

    constructor(
        authId: string | null,
        firstName: string,
        lastName: string,
        language: string,
        emailAddress: string,
        role: Role | null,
        dateCreated: Date,
        status: Status,
        organizationId: string
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

    getAuthId(): string|null {
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

    getLanguage(): string {
        return this.language;
    }

    setLanguage(language: string): void {
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

    getDateCreated(): Date {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    getStatus(): Status {
        return this.status;
    }

    setStatus(status: Status) {
        this.status = status;
    }

    getOrganizationId(): string {
        return this.organizationId
    }

    setOrganizationId(organizationId: string):void {
        this.organizationId = organizationId;
    }

    // protected universityId!: number;
}
