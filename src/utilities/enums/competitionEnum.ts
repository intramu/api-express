/** Enums related to competitions */
export enum CompetitionVisibility {
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC",
}

export enum CompetitionStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export enum CompetitionSeason {
    FALL = "FALL",
    SPRING = "SPRING",
    SUMMER = "SUMMER",
}

export enum TournamentType {
    SINGLE = "SINGLE",
    DOUBLE = "DOUBLE",
    ROUNDROBIN = "ROUND",
    PICKFORME = "PICKFORME",
}
export enum TournamentSeedType {
    POINTS = "POINTS",
    RANDOM = "RANDOM",
}
export enum TournamentGameStatus {
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

export enum ContestType {
    POINTS = "POINTS",
}
export enum PlayoffSeedingType {
    CROSS = "CROSS",
    INDEPENDENT = "INDEPENDENT",
}
export enum PlayoffType {
    SINGLE = "SINGLE",
    DOUBLE = "DOUBLE",
    ROUNDROBIN = "ROUND",
    PICKFORME = "PICKFORME",
}
export enum DivisionType {
    MENS = "MENS",
    WOMENS = "WOMENS",
    COREC = "COREC",
    WAITLIST = "WAITLIST",
}
export enum DivisionLevel {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
}

export enum DivisionStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    ADDITIONS = "ADDITIONS",
    PLAYOFFS = "PLAYOFFS",
    SCHEDULED = "SCHEDULED",
}

export enum ContestGameStatus {
    NULL,
    NOTPLAYED,
    TOBEDETERMINED,
    WON,
    LOST,
    FORFEIT,
    SUSPENDED,
    WEATHER,
    RESCHEDULED,
    OTHER,
}
