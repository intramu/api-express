export interface IPlayerInvite {
    authId: string;
    teamId: number;
    requestingPlayerFullName: string;
    requestingTeamName: string;
    timeSent: Date;
    expirationTime: Date;
}

export interface IPlayerInviteDatabase {
    player_auth_id: string;
    team_id: number;
    requesting_player_full_name: string;
    requesting_team_name: string;
    time_sent: Date;
    expiration_time: Date;
}

export const convertFromDatabaseFormat = (request: IPlayerInviteDatabase): IPlayerInvite => ({
    authId: request.player_auth_id,
    teamId: request.team_id,
    requestingPlayerFullName: request.requesting_player_full_name,
    requestingTeamName: request.requesting_team_name,
    timeSent: request.time_sent,
    expirationTime: request.expiration_time,
});
