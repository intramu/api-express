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

    public getAuthId(): string {
        return this.authId;
    }

    public setAuthId(authId: string): void {
        this.authId = authId;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public setFirstName(firstName: string): void {
        this.firstName = firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public setLastName(lastName: string): void {
        this.lastName = lastName;
    }

    public getLanguage(): string {
        return this.language;
    }

    public setLanguage(language: string): void {
        this.language = language;
    }

    public getEmailAddress(): string {
        return this.emailAddress;
    }

    public setEmailAddress(emailAddress: string): void {
        this.emailAddress = emailAddress;
    }

    public getRole(): string | null {
        return this.role;
    }

    public setRole(role: string | null): void {
        this.role = role;
    }

    public getDateCreated(): Date {
        return this.dateCreated;
    }

    public setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    public getStatus(): string {
        return this.status;
    }

    public setStatus(status: string) {
        this.status = status;
    }

    // protected universityId!: number;
}
