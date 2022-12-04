import { User } from "./User";

export class Admin extends User
{
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
        super(authId, firstName, lastName, language, emailAddress, role, dateCreated, status);
    }
} 