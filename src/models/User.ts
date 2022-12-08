export abstract class User {
    protected authId: string;

    protected firstName: string;

    protected lastName: string;

    protected language: string;

    protected emailAddress: string;

    protected role: string | null;

    protected dateCreated: Date;

    protected status: string;

    constructor(
        authId: string,
        firstName: string,
        lastName: string,
        language: string,
        emailAddress: string,
        role: string | null,
        dateCreated: Date,
        status: string
    ) {
        this.authId = authId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.language = language;
        this.emailAddress = emailAddress;
        this.role = role;
        this.dateCreated = dateCreated;
        this.status = status;
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

    getRole(): string | null {
        return this.role;
    }

    setRole(role: string | null): void {
        this.role = role;
    }

    getDateCreated(): Date {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    getStatus(): string {
        return this.status;
    }

    setStatus(status: string) {
        this.status = status;
    }

    // protected universityId!: number;
}
