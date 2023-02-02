import { Status } from "../utilities/enums";

export class Organization {
    private id: string;

    private name: string;

    private image: string;

    private info: string;

    private mainColor: string;

    private approvalStatus: Status | null;

    private dateCreated: Date | null;

    constructor(props: {
        id: string;
        name: string;
        image: string;
        info: string;
        mainColor: string;
        approvalStatus: Status | null;
        dateCreated: Date | null;
    }) {
        this.id = props.id;
        this.name = props.name;
        this.image = props.image;
        this.info = props.info;
        this.mainColor = props.mainColor;
        this.approvalStatus = props.approvalStatus;
        this.dateCreated = props.dateCreated;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getImage(): string {
        return this.image;
    }

    setImage(image: string): void {
        this.image = image;
    }

    getInfo(): string {
        return this.info;
    }

    setInfo(info: string): void {
        this.info = info;
    }

    getMainColor(): string {
        return this.mainColor;
    }

    setMainColor(mainColor: string): void {
        this.mainColor = mainColor;
    }

    getApprovalStatus(): Status | null {
        return this.approvalStatus;
    }

    setApprovalStatus(approvalStatus: Status | null): void {
        this.approvalStatus = approvalStatus;
    }

    getDateCreated(): Date | null {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date | null): void {
        this.dateCreated = dateCreated;
    }
}
