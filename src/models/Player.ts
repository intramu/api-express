import { Gender, Language, Role, Status, Visibility } from "../utilities/enums";
import { User } from "./User";

export class Player extends User {
    protected gender;

    protected dob;

    protected visibility;

    protected graduationTerm;

    protected image;

    protected phoneNumber: string;

    constructor(props: {
        authId: string | null;
        firstName: string;
        lastName: string;
        language: Language | null;
        emailAddress: string;
        role: Role | null;
        gender: Gender | null;
        dob: Date | null;
        visibility: Visibility | null;
        graduationTerm: string;
        image: string;
        status: Status | null;
        dateCreated: Date | null;
        organizationId: string;
    }) {
        super(
            props.authId,
            props.firstName,
            props.lastName,
            props.language,
            props.emailAddress,
            props.role,
            props.dateCreated,
            props.status,
            props.organizationId
        );

        this.phoneNumber = "";
        this.gender = props.gender;
        this.dob = props.dob;
        this.visibility = props.visibility;
        this.graduationTerm = props.graduationTerm;
        this.image = props.image;
    }

    getPhoneNumber(): string | null {
        return this.phoneNumber;
    }

    setPhoneNumber(phoneNumber: string): void {
        this.phoneNumber = phoneNumber;
    }

    getGender(): Gender | null {
        return this.gender;
    }

    setGender(gender: Gender): void {
        this.gender = gender;
    }

    getDob(): Date | null {
        return this.dob;
    }

    setDob(dob: Date): void {
        this.dob = dob;
    }

    getVisibility(): Visibility | null {
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

    getImage(): string {
        return this.image;
    }

    setImage(image: string): void {
        this.image = image;
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
