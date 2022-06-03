import { User } from "./User";

export class Player extends User {
    protected gender!: string;
    protected dob!: Date;
    protected language!: string;
    protected profileVisibility!: string;
    protected graduationDate!: string;
    protected year!: string;
    protected image!: string;
    protected teamId!: string;
    protected status!: string;
    protected teamRole!: string;

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

    public static SecondaryPlayer(
        $authId: number,
        $firstName: string,
        $lastName: string,
        // $role: string
        $gender: string,
        $dob: Date,
        $language: string,
        $profileVisibility: string,
        $graduationDate: string,
        $year: string,
        $image: string,
        $teamId: string,
        $status: string,
        $teamRole: string
    ) {
        var result = new Player();

        result.authId = $authId;
        result.firstName = $firstName;
        result.lastName = $lastName;
        result.gender = $gender;
        result.dob = $dob;
        result.language = $language;
        result.profileVisibility = $profileVisibility;
        result.graduationDate = $graduationDate;
        result.year = $year;
        result.image = $image;
        result.teamId = $teamId;
        result.status = $status;
        result.teamRole = $teamRole;

        return result;
    }

    public static Default() {
        var result = new Player();
        return result;
    }

    public get $authId(): number {
        return this.authId;
    }
    public set $authId(value: number) {
        this.authId = value;
    }

    public get $firstName(): string {
        return this.firstName;
    }
    public set $firstName(value: string) {
        this.firstName = value;
    }

    public get $lastName(): string {
        return this.lastName;
    }
    public set $lastName(value: string) {
        this.lastName = value;
    }

    // public get $role(): string {
    //     return this.role;
    // }
    // public set $role(value: string) {
    //     this.role = value;
    // }

    // public get $universityId(): number {
    //     return this.universityId;
    // }
    // public set $universityId(value: number) {
    //     this.universityId = value;
    // }

    /**
     * Getter $gender
     * @return {string}
     */
    public get $gender(): string {
        return this.gender;
    }

    /**
     * Getter $dob
     * @return {Date}
     */
    public get $dob(): Date {
        return this.dob;
    }

    /**
     * Getter $language
     * @return {string}
     */
    public get $language(): string {
        return this.language;
    }

    /**
     * Getter $profileVisibility
     * @return {string}
     */
    public get $profileVisibility(): string {
        return this.profileVisibility;
    }

    /**
     * Getter $graduationDate
     * @return {string}
     */
    public get $graduationDate(): string {
        return this.graduationDate;
    }

    /**
     * Getter $year
     * @return {string}
     */
    public get $year(): string {
        return this.year;
    }

    /**
     * Getter $profilePicture
     * @return {string}
     */
    public get $image(): string {
        return this.image;
    }

    /**
     * Getter $teamId
     * @return {string}
     */
    public get $teamId(): string {
        return this.teamId;
    }

    /**
     * Getter $status
     * @return {number}
     */
    public get $status(): string {
        return this.status;
    }

    /**
     * Getter $teamRole
     * @return {string}
     */
    public get $teamRole(): string {
        return this.teamRole;
    }

    /**
     * Setter $gender
     * @param {string} value
     */
    public set $gender(value: string) {
        this.gender = value;
    }

    /**
     * Setter $dob
     * @param {Date} value
     */
    public set $dob(value: Date) {
        this.dob = value;
    }

    /**
     * Setter $language
     * @param {string} value
     */
    public set $language(value: string) {
        this.language = value;
    }

    /**
     * Setter $profileVisibility
     * @param {string} value
     */
    public set $profileVisibility(value: string) {
        this.profileVisibility = value;
    }

    /**
     * Setter $graduationDate
     * @param {string} value
     */
    public set $graduationDate(value: string) {
        this.graduationDate = value;
    }

    /**
     * Setter $year
     * @param {string} value
     */
    public set $year(value: string) {
        this.year = value;
    }

    /**
     * Setter $profilePicture
     * @param {string} value
     */
    public set $image(value: string) {
        this.image = value;
    }

    /**
     * Setter $teamId
     * @param {string} value
     */
    public set $teamId(value: string) {
        this.teamId = value;
    }

    /**
     * Setter $status
     * @param {number} value
     */
    public set $status(value: string) {
        this.status = value;
    }

    /**
     * Setter $teamRole
     * @param {string} value
     */
    public set $teamRole(value: string) {
        this.teamRole = value;
    }
}
