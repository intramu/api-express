import { User } from "./User";

export class Player extends User 
{
    protected gender: string;
    protected dob: Date;
    protected visibility: string;
    protected graduationTerm: string;
    protected image: string|null;

    constructor(
        authId: string,
        firstName: string,
        lastName: string,
        language: string,
        emailAddress: string,
        role: string|null,
        gender: string,
        dob: Date,
        visibility: string,
        graduationTerm: string,
        image: string|null,
        status: string,
        dateCreated: Date,
    ) {
        super(authId, firstName, lastName, language, emailAddress, role, dateCreated, status);

        this.gender = gender
        this.dob = dob
        this.visibility = visibility
        this.graduationTerm = graduationTerm
        this.image = image
    }


    public getGender(): string {
        return this.gender;
    }

    public setGender(gender: string): void {
        this.gender = gender;
    }

    public getDob(): Date {
        return this.dob;
    }

    public setDob(dob: Date): void {
        this.dob = dob;
    }

    public getVisibility(): string {
        return this.visibility;
    }

    public setVisibility(visibility: string): void {
        this.visibility = visibility;
    }

    public getGraduationTerm(): string {
        return this.graduationTerm;
    }

    public setGraduationTerm(graduationTerm: string): void {
        this.graduationTerm = graduationTerm;
    }

    public getImage(): string|null {
        return this.image;
    }

    public setImage(image: string|null): void {
        this.image = image;
    }

    public getStatus(): string {
        return this.status;
    }

    public setStatus(status: string): void {
        this.status = status;
    }

    //Constructors
    // public static test($id: number, $firstName: string): Player {
    //     var result = new Player();

    //     result.id = $id;
    //     result.firstName = $firstName;
    //     return result;
    // }

    // public static fromProps({
    //     id,
    //     firstName,
    //     lastName,
    //     emailAddress,
    //     password,
    //     role = "student",
    //     universityId,
    //     gender,
    //     dob,
    //     language = "en",
    //     profileVisibility = "visable",
    //     graduationDate,
    //     year,
    //     image,
    //     teamId,
    //     status,
    //     teamRole,
    // }: {
    //     id: number;
    //     firstName: string;
    //     lastName: string;
    //     emailAddress: string;
    //     password: string;
    //     role: string;
    //     universityId: number;
    //     gender: string;
    //     dob: Date;
    //     language: string;
    //     profileVisibility: string;
    //     graduationDate: string;
    //     year: string;
    //     image: string;
    //     teamId: string;
    //     status: string;
    //     teamRole: string;
    // }) {
    //     var result = new Player();

    //     result.id = id;
    //     result.firstName = firstName;
    //     result.lastName = lastName;
    //     result.emailAddress = emailAddress;
    //     result.password = password;
    //     result.role = role;
    //     result.universityId = universityId;
    //     result.gender = gender;
    //     result.dob = dob;
    //     result.language = language;
    //     result.profileVisibility = profileVisibility;
    //     result.graduationDate = graduationDate;
    //     result.year = year;
    //     result.image = image;
    //     result.teamId = teamId;
    //     result.status = status;
    //     result.teamRole = teamRole;

    //     return result;
    // }

    // public static SecondaryPlayer(
    //     $authId: number,
    //     $firstName: string,
    //     $lastName: string,
    //     $language: string,
    //     $role: string,
    //     $gender: string,
    //     $dob: Date,
    //     $visibility: string,
    //     $graduationTerm: string,
    //     $image: string,
    //     $status: string
    //     // $teamRole: string
    //     //dateCreated -- in database
    // ) {
    //     var result = new Player();

    //     result.authId = $authId;
    //     result.firstName = $firstName;
    //     result.lastName = $lastName;
    //     result.gender = $gender;
    //     result.role = $role;
    //     result.dob = $dob;
    //     result.language = $language;
    //     result.visibility = $visibility;
    //     result.graduationTerm = $graduationTerm;
    //     result.image = $image;
    //     result.status = $status;

    //     return result;
    // }

    // public static Default() {
    //     var result = new Player();
    //     return result;
    // }

}