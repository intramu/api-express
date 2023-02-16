import {
    Language,
    PlayerGender,
    PlayerStatus,
    PlayerVisibility,
} from "../utilities/enums/userEnum";
import { User } from "./User";

export class Player extends User {
    protected status: PlayerStatus | null;

    protected gender: PlayerGender | null;

    protected dob: Date | null;

    protected visibility: PlayerVisibility | null;

    protected graduationTerm: string;

    protected image: string;

    protected phoneNumber: string;

    constructor() {
        super("", "", "", null, "", null);
        this.status = null;
        this.gender = null;
        this.dob = null;
        this.visibility = null;
        this.graduationTerm = "";
        this.image = "";
        this.phoneNumber = "";
    }
    // constructor(props: {
    //     authId: string;
    //     firstName: string;
    //     lastName: string;
    //     language: Language | null;
    //     emailAddress: string;
    //     // role: Role | null;
    //     gender: PlayerGender | null;
    //     dob: Date | null;
    //     visibility: PlayerVisibility | null;
    //     graduationTerm: string;
    //     image: string;
    //     status: PlayerStatus | null;
    //     dateCreated: Date | null;
    //     // organizationId: string;
    // }) {
    //     super(
    //         props.authId,
    //         props.firstName,
    //         props.lastName,
    //         props.language,
    //         props.emailAddress,
    //         // props.role,
    //         props.dateCreated
    //         // props.status
    //         // props.organizationId
    //     );

    //     this.phoneNumber = "";
    //     this.status = props.status;
    //     this.gender = props.gender;
    //     this.dob = props.dob;
    //     this.visibility = props.visibility;
    //     this.graduationTerm = props.graduationTerm;
    //     this.image = props.image;
    // }

    public static Player(props: {
        authId: string;
        firstName: string;
        lastName: string;
        language: Language | null;
        emailAddress: string;
        // role: Role | null;
        gender: PlayerGender | null;
        dob: Date | null;
        visibility: PlayerVisibility | null;
        graduationTerm: string;
        image: string;
        status: PlayerStatus | null;
        dateCreated: Date | null;
        // organizationId: string;
    }) {
        const obj = new Player();

        obj.authId = props.authId;
        obj.firstName = props.firstName;
        obj.lastName = props.lastName;
        obj.language = props.language;
        obj.emailAddress = props.emailAddress;
        obj.gender = props.gender;
        obj.dob = props.dob;
        obj.visibility = props.visibility;
        obj.graduationTerm = props.graduationTerm;
        obj.status = props.status;
        obj.dateCreated = props.dateCreated;
        obj.image = props.image;

        return obj;
    }

    public static PlayerNew(props: {
        authId: string;
        firstName: string;
        lastName: string;
        language: Language;
        emailAddress: string;
        gender: PlayerGender;
        dob: Date;
        visibility: PlayerVisibility;
        graduationTerm: string;
        image: string;
    }) {
        const obj = new Player();
        obj.authId = props.authId;
        obj.firstName = props.firstName;
        obj.lastName = props.lastName;
        obj.language = props.language;
        obj.emailAddress = props.emailAddress;
        obj.gender = props.gender;
        obj.dob = props.dob;
        obj.visibility = props.visibility;
        obj.graduationTerm = props.graduationTerm;
        obj.image = props.image;

        return obj;
    }

    getPhoneNumber(): string | null {
        return this.phoneNumber;
    }

    setPhoneNumber(phoneNumber: string): void {
        this.phoneNumber = phoneNumber;
    }

    getGender(): PlayerGender | null {
        return this.gender;
    }

    setGender(gender: PlayerGender): void {
        this.gender = gender;
    }

    getDob(): Date | null {
        return this.dob;
    }

    setDob(dob: Date): void {
        this.dob = dob;
    }

    getVisibility(): PlayerVisibility | null {
        return this.visibility;
    }

    setVisibility(visibility: PlayerVisibility): void {
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

    getStatus(): PlayerStatus | null {
        return this.status;
    }

    setStatus(status: PlayerStatus | null) {
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
