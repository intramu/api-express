import { IPlayerProps } from "../interfaces/Player";
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

    constructor(props: Partial<IPlayerProps>) {
        const {
            authId = "",
            firstName = "",
            lastName = "",
            language = null,
            emailAddress = "",
            dateCreated = null,
            status = null,
            gender = null,
            dob = null,
            visibility = null,
            graduationTerm = "",
            image = "",
        } = props;

        super(authId, firstName, lastName, language, emailAddress, dateCreated);
        this.status = status;
        this.gender = gender;
        this.dob = dob;
        this.visibility = visibility;
        this.graduationTerm = graduationTerm;
        this.image = image;
        this.phoneNumber = "";
    }

    // changes database snakecase to camelcase for application
    public static fromDatabase(props: {
        auth_id: string;
        first_name: string;
        last_name: string;
        language: Language;
        email_address: string;
        gender: PlayerGender;
        dob: Date;
        visibility: PlayerVisibility;
        graduation_term: string;
        image: string;
        status: PlayerStatus;
        date_created: Date;
    }) {
        const obj = new Player(props);
        obj.authId = props.auth_id;
        obj.firstName = props.first_name;
        obj.lastName = props.last_name;
        obj.emailAddress = props.email_address;
        obj.graduationTerm = props.graduation_term;
        obj.dateCreated = props.date_created;
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
