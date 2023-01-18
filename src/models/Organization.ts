export class Organization {
    private id: string;

    private name: string;

    private image: string;

    private info: string;

    private mainColor: string;

    private approvalStatus: string;

    private dateCreated: Date | null;

    constructor(
        id: string,
        name: string,
        image: string,
        info: string,
        mainColor: string,
        approvalStatus: string,
        dateCreated: Date | null
    ) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.info = info;
        this.mainColor = mainColor;
        this.approvalStatus = approvalStatus;
        this.dateCreated = dateCreated;
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

    getApprovalStatus(): string {
        return this.approvalStatus;
    }

    setApprovalStatus(approvalStatus: string): void {
        this.approvalStatus = approvalStatus;
    }

    getDateCreated(): Date | null {
        return this.dateCreated;
    }

    setDateCreated(dateCreated: Date | null): void {
        this.dateCreated = dateCreated;
    }
}
