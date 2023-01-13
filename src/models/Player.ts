import { Role, Status, Visibility } from "../utilities/enums";
import { User } from "./User";

export class Player extends User {
    protected gender: string;

    protected dob: Date;

    protected visibility: Visibility;

    protected graduationTerm: string;

    protected image: string | null;

    protected phoneNumber: string;

    constructor(
        authId: string|null,
        firstName: string,
        lastName: string,
        language: string,
        emailAddress: string,
        phoneNumber: string,
        role: Role | null,
        gender: string,
        dob: Date,
        visibility: Visibility,
        graduationTerm: string,
        image: string | null,
        status: Status,
        dateCreated: Date,
        organizationId: string
    ) {
        super(authId, firstName, lastName, language, emailAddress, role, dateCreated, status, organizationId);

        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.dob = dob;
        this.visibility = visibility;
        this.graduationTerm = graduationTerm;
        this.image = image;
    }

    getPhoneNumber(): string{
        return this.phoneNumber
    }

    setPhoneNumber(phoneNumber: string): void {
        this.phoneNumber = phoneNumber;
    }

    getGender(): string {
        return this.gender;
    }

    setGender(gender: string): void {
        this.gender = gender;
    }

    getDob(): Date {
        return this.dob;
    }

    setDob(dob: Date): void {
        this.dob = dob;
    }

    getVisibility(): Visibility {
        return this.visibility;
    }

    setVisibility(visibility: Visibility): void {
        this.visibility = visibility;
    }

    getGraduationTerm(): string {
        return this.graduationTerm;
    }

    setGraduationTerm(graduationTerm: string): void {
        this.graduationTerm = graduationTerm;
    }

    getImage(): string | null {
        return this.image;
    }

    setImage(image: string | null): void {
        this.image = image;
    }

    getStatus(): Status {
        return this.status;
    }

    setStatus(status: Status): void {
        this.status = status;
    }

    // Constructors
    // static test($id: number, $firstName: string): Player {
    //     var result = new Player();

    //     result.id = $id;
    //     result.firstName = $firstName;
    //     return result;
    // }

    // static fromProps({
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

    // static SecondaryPlayer(
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

    // static Default() {
    //     var result = new Player();
    //     return result;
    // }
}
