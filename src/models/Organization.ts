import { OrganizationStatus } from "../utilities/enums/commonEnum";

interface IOrganizationProps {
    id: string;
    name: string;
    image: string;
    info: string;
    mainColor: string;
    approvalStatus: OrganizationStatus;
    dateCreated: Date;
}

export class Organization {
    private id: string;

    private name: string;

    private image: string;

    private info: string;

    private mainColor: string;

    private approvalStatus: OrganizationStatus | null;

    private dateCreated: Date | null;

    constructor(props: Partial<IOrganizationProps>) {
        const {
            id = "",
            name = "",
            image = "",
            info = "",
            mainColor = "",
            approvalStatus = null,
            dateCreated = null,
        } = props;

        this.id = id;
        this.name = name;
        this.image = image;
        this.info = info;
        this.mainColor = mainColor;
        this.approvalStatus = approvalStatus;
        this.dateCreated = dateCreated;
    }

    public static fromDatabase(props: {
        id: string;
        name: string;
        image: string;
        info: string;
        main_color: string;
        approval_status: OrganizationStatus | null;
        date_created: Date | null;
    }) {
        const obj = new Organization(props);
        obj.mainColor = props.main_color;
        obj.approvalStatus = props.approval_status;
        obj.dateCreated = props.date_created;
        return obj;
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

    getApprovalStatus(): OrganizationStatus | null {
        return this.approvalStatus;
    }

    setApprovalStatus(approvalStatus: OrganizationStatus | null): void {
        this.approvalStatus = approvalStatus;
    }

    getDateCreated(): Date | null {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date | null): void {
        this.dateCreated = dateCreated;
    }
}
