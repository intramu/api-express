/** Enums related to user entities
 *
 * Includes Player and Admin
 */
export enum PlayerGender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export enum Language {
    ENGLISH = "ENGLISH",
}

export enum PlayerStatus {
    ACTIVE = "ACTIVE",
    INCOMPLETE = "INCOMPLETE",
    BANNED = "BANNED",
    GRADUATED = "GRADUATED",
}

export enum PlayerVisibility {
    OPEN = "OPEN",
    PRIVATE = "PRIVATE",
    CLOSED = "CLOSED",
}

export enum AdminRole {
    MASTER = "MASTER",
    WORKER = "WORKER",
}

export enum AdminStatus {
    ACTIVE = "ACTIVE",
    DISABLED = "DISABLED",
}
