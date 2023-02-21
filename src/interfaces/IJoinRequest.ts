export interface IJoinRequest {
    authId: string;
    teamId: number;
    requestingPlayerName: string;
    timeSent: Date;
    expirationTime: Date;
}
