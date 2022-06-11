"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const User_1 = require("./User");
class Player extends User_1.User {
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
    static SecondaryPlayer($authId, $firstName, $lastName, $language, $role, $gender, $dob, $visibility, $graduationTerm, $image, $status
    // $teamRole: string
    //dateCreated -- in database
    ) {
        var result = new Player();
        result.authId = $authId;
        result.firstName = $firstName;
        result.lastName = $lastName;
        result.gender = $gender;
        result.role = $role;
        result.dob = $dob;
        result.language = $language;
        result.visibility = $visibility;
        result.graduationTerm = $graduationTerm;
        result.image = $image;
        result.status = $status;
        return result;
    }
    static Default() {
        var result = new Player();
        return result;
    }
    get $authId() {
        return this.authId;
    }
    set $authId(value) {
        this.authId = value;
    }
    get $firstName() {
        return this.firstName;
    }
    set $firstName(value) {
        this.firstName = value;
    }
    get $lastName() {
        return this.lastName;
    }
    set $lastName(value) {
        this.lastName = value;
    }
    get $role() {
        return this.role;
    }
    set $role(value) {
        this.role = value;
    }
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
    get $gender() {
        return this.gender;
    }
    /**
     * Getter $dob
     * @return {Date}
     */
    get $dob() {
        return this.dob;
    }
    /**
     * Getter $language
     * @return {string}
     */
    get $language() {
        return this.language;
    }
    /**
     * Getter $profileVisibility
     * @return {string}
     */
    get $visibility() {
        return this.visibility;
    }
    /**
     * Getter $graduationDate
     * @return {string}
     */
    get $graduationTerm() {
        return this.graduationTerm;
    }
    /**
     * Getter $profilePicture
     * @return {string}
     */
    get $image() {
        return this.image;
    }
    /**
     * Getter $status
     * @return {number}
     */
    get $status() {
        return this.status;
    }
    /**
     * Getter $teamRole
     * @return {string}
     */
    get $teamRole() {
        return this.teamRole;
    }
    /**
     * Setter $gender
     * @param {string} value
     */
    set $gender(value) {
        this.gender = value;
    }
    /**
     * Setter $dob
     * @param {Date} value
     */
    set $dob(value) {
        this.dob = value;
    }
    /**
     * Setter $language
     * @param {string} value
     */
    set $language(value) {
        this.language = value;
    }
    /**
     * Setter $profileVisibility
     * @param {string} value
     */
    set $visibility(value) {
        this.visibility = value;
    }
    /**
     * Setter $graduationDate
     * @param {string} value
     */
    set $graduationTerm(value) {
        this.graduationTerm = value;
    }
    /**
     * Setter $profilePicture
     * @param {string} value
     */
    set $image(value) {
        this.image = value;
    }
    /**
     * Setter $status
     * @param {number} value
     */
    set $status(value) {
        this.status = value;
    }
    /**
     * Setter $teamRole
     * @param {string} value
     */
    set $teamRole(value) {
        this.teamRole = value;
    }
}
exports.Player = Player;
