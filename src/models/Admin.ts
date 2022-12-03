import { User } from "./User";

export class Admin extends User
{
    protected authId: string;
    protected firstName: string;
    protected lastName: string;
    protected language: string;
    protected emailAddress: string;
    protected role: string;
    protected dateCreated: Date;
    protected status: string;

    constructor(
        authId: string, 
        firstName: string,
        lastName: string,
        language: string,
        emailAddress: string,
        role: string,
        dateCreated: Date,
        status: string 
    )
    {
        super();
        this.authId = authId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.language = language;
        this.emailAddress = emailAddress;
        this.role = role;
        this.dateCreated = dateCreated;
        this.status = status;
    }

    // public getAuthId(): string {
    //     return this.authId;
    // }

    // public setAuthId(authId: string): void {
    //     this.authId = authId;
    // }
}