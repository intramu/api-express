export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export enum Language {
    ENGLISH = "ENGLISH",
}

export enum Role {
    CAPTAIN = "CAPTAIN",
    COCAPTAIN = "COCAPTAIN",
    PLAYER = "PLAYER",
    MASTER = "MASTER",
    WORKER = "WORKER",
}

export enum Visibility {
    PRIVATE = "PRIVATE",
    OPEN = "OPEN",
    CLOSED = "CLOSED",
}

export enum Status {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    INCOMPLETE = "INCOMPLETE",
    BANNED = "BANNED",
    GRADUATED = "GRADUATED",
}

export enum TournamentType {
    SINGLE = "SINGLE",
    DOUBLE = "DOUBLE",
    ROUNDROBIN = "ROUND",
    RANDOM = "RANDOM",
}

export enum TournamentSeedType {
    POINTS = "POINTS",
    RANKING = "RANKING",
    RANDOM = "RANDOM",
}

export enum TournamentStatus {
    NOTPLAYED = "NOTPLAYED",
    TOBEDETERMINED = "TOBEDETERMINED",
    WON = "WON",
    LOST = "LOST",
    FORFEIT = "FORFEIT",
    SUSPENDED = "SUSPENDED",
    WEATHER = "WEATHER",
    RESCHEDULED = "RESCHEDULED",
    OTHER = "OTHER",
}
