import { AdminStatus, Language, PlayerStatus } from "../utilities/enums/userEnum";

export abstract class User {
    protected authId: string;

    protected firstName: string;

    protected lastName: string;

    protected language: Language | null;

    protected emailAddress: string;

    // protected role: Role | null;

    protected dateCreated: Date | null;

    // protected status: PlayerStatus | AdminStatus | null;

    // protected organizationId: string;

    constructor(
        authId: string,
        firstName: string,
        lastName: string,
        language: Language | null,
        emailAddress: string,
        // role: Role | null,
        dateCreated: Date | null
        // status: PlayerStatus | null
        // organizationId: string
    ) {
        this.authId = authId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.language = language;
        this.emailAddress = emailAddress;
        // this.role = role;
        this.dateCreated = dateCreated;
        // this.status = status;
        // this.organizationId = organizationId;
    }

    getAuthId(): string {
        return this.authId;
    }

    setAuthId(authId: string): void {
        this.authId = authId;
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

    // getRole(): Role | null {
    //     return this.role;
    // }

    // setRole(role: Role | null): void {
    //     this.role = role;
    // }

    getDateCreated(): Date | null {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    // getStatus(): PlayerStatus | null {
    //     return this.status;
    // }

    // setStatus(status: PlayerStatus | null) {
    //     this.status = status;
    // }

    // getOrganizationId(): string {
    //     return this.organizationId;
    // }

    // setOrganizationId(organizationId: string): void {
    //     this.organizationId = organizationId;
    // }

    // protected universityId!: number;
}
