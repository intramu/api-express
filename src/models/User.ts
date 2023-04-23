import { Language } from "../utilities/enums/userEnum";

/**
 * Parent abstract class for Admin and Player models to extend from
 * Includes common fields like authId and dateCreated
 */
export abstract class User {
    protected authId: string;

    protected firstName: string;

    protected lastName: string;

    protected language: Language | null;

    protected emailAddress: string;

    protected dateCreated: Date | null;

    // protected organizationId: string;

    constructor(
        authId: string,
        firstName: string,
        lastName: string,
        language: Language | null,
        emailAddress: string,
        dateCreated: Date | null
        // organizationId: string
    ) {
        this.authId = authId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.language = language;
        this.emailAddress = emailAddress;
        this.dateCreated = dateCreated;
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

    getDateCreated(): Date | null {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    // getOrganizationId(): string {
    //     return this.organizationId;
    // }

    // setOrganizationId(organizationId: string): void {
    //     this.organizationId = organizationId;
    // }

    // protected universityId!: number;
}
