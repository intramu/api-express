export class Organization {
    private id: string;
    private name: string;
    private image: string;
    private info: string;
    private mainColor: string;
    private approvalStatus: string;
    private dateCreated: Date;

    constructor(
        $id: string,
        $name: string,
        $image: string,
        $info: string,
        $mainColor: string,
        $approvalStatus: string,
        $dateCreated: Date
    ) {
        this.id = $id;
        this.name = $name;
        this.image = $image;
        this.info = $info;
        this.mainColor = $mainColor;
        this.approvalStatus = $approvalStatus;
        this.dateCreated = $dateCreated;
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getImage(): string {
        return this.image;
    }

    public setImage(image: string): void {
        this.image = image;
    }

    public getInfo(): string {
        return this.info;
    }

    public setInfo(info: string): void {
        this.info = info;
    }

    public getMainColor(): string {
        return this.mainColor;
    }

    public setMainColor(mainColor: string): void {
        this.mainColor = mainColor;
    }

    public getApprovalStatus(): string {
        return this.approvalStatus;
    }

    public setApprovalStatus(approvalStatus: string): void {
        this.approvalStatus = approvalStatus;
    }

    public getDateCreated(): Date {
        return this.dateCreated;
    }

    public setDateCreated(dateCreated: Date): void {
        this.dateCreated = dateCreated;
    }
}
