export interface IJoinRequest {
    authId: string;
    teamId: number;
    requestingPlayerFullName: string;
    timeSent: Date;
    expirationTime: Date;
}

export interface IJoinRequestDatabase {
    player_auth_id: string;
    team_id: number;
    requesting_player_full_name: string;
    time_sent: Date;
    expiration_time: Date;
}

export const convertFromDatabaseFormat = (request: IJoinRequestDatabase): IJoinRequest => ({
    authId: request.player_auth_id,
    teamId: request.team_id,
    requestingPlayerFullName: request.requesting_player_full_name,
    timeSent: request.time_sent,
    expirationTime: request.expiration_time,
});
