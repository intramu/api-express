import { TeamRole } from "../utilities/enums/teamEnum";
import { PlayerGender, PlayerStatus } from "../utilities/enums/userEnum";

interface SmallProps {
    authId: string;
    role: TeamRole;
    firstName: string;
    lastName: string;
    gender: PlayerGender;
    status: PlayerStatus;
    image: string;
}
export class PlayerSmall {
    protected authId;

    protected role;

    protected firstName;

    protected lastName;

    protected gender;

    protected status;

    protected image;

    constructor(props: Partial<SmallProps>) {
        const {
            authId = "",
            firstName = "",
            lastName = "",
            gender = PlayerGender.MALE,
            image = "",
            role = TeamRole.PLAYER,
            status = PlayerStatus.ACTIVE,
        } = props;

        this.authId = authId;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.status = status;
        this.image = image;
    }

    public static fromDatabase(props: {
        auth_id: string;
        role: TeamRole;
        first_name: string;
        last_name: string;
        gender: PlayerGender;
        status: PlayerStatus;
        image: string;
    }) {
        const obj = new PlayerSmall(props);
        obj.authId = props.auth_id;
        obj.firstName = props.first_name;
        obj.lastName = props.last_name;

        return obj;
    }

    public getAuthId(): string {
        return this.authId;
    }

    public setAuthId(authId: string): void {
        this.authId = authId;
    }

    public getRole(): TeamRole {
        return this.role;
    }

    public setRole(role: TeamRole): void {
        this.role = role;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public setFirstName(firstName: string): void {
        this.firstName = firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public setLastName(lastName: string): void {
        this.lastName = lastName;
    }

    public getGender(): PlayerGender {
        return this.gender;
    }

    public setGender(gender: PlayerGender): void {
        this.gender = gender;
    }

    public getStatus(): PlayerStatus {
        return this.status;
    }

    public setStatus(status: PlayerStatus): void {
        this.status = status;
    }

    public getImage(): string {
        return this.image;
    }

    public setImage(image: string): void {
        this.image = image;
    }
}
