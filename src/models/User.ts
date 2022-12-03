export abstract class User 
{
    protected abstract authId: string;
    protected abstract firstName: string;
    protected abstract lastName: string;
    protected abstract language: string;
    protected abstract emailAddress: string;
    protected abstract role: string;
    protected abstract dateCreated: Date
    protected abstract status: string;
    

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

    public getRole(): string {
        return this.role;
    }

    public setRole(role: string): void {
        this.role = role;
    }

    public getDateCreated(): Date {
        return this.dateCreated;
    }

    public setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }

    public getStatus(): String {
        return this.status;
    }

    public setStatus(status: string){
        this.status = status;
    }

    // protected universityId!: number;

}
