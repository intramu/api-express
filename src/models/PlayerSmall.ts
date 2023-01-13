import { Gender, Role, Status } from "../utilities/enums";

export class PlayerSmall{
    protected authId: string;
    protected role: Role;
    protected firstName: string;
    protected lastName: string;
    protected gender: Gender;
    protected status: Status;
    protected image: string;

    constructor(authId: string, role: Role, firstName: string, lastName: string, gender: Gender, status: Status, image: string)
    {
        this.authId = authId;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.status = status;
        this.image = image;
    }

    public getAuthId(): string {
        return this.authId;
    }

    public setAuthId(authId: string): void {
        this.authId = authId;
    }

    public getRole(): Role {
        return this.role;
    }

    public setRole(role: Role): void {
        this.role = role;
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

    public getGender(): Gender {
        return this.gender;
    }

    public setGender(gender: Gender): void {
        this.gender = gender;
    }

    public getStatus(): Status {
        return this.status;
    }

    public setStatus(status: Status): void {
        this.status = status;
    }

    public getImage(): string {
        return this.image;
    }

    public setImage(image: string): void {
        this.image = image;
    }    
}