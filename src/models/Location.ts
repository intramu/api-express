interface LocationProps {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    name: string;
    details: string;
}

export class Location {
    protected id;

    protected address;

    protected city;

    protected state;

    protected zipCode;

    protected name;

    protected details;

    constructor(props: Partial<LocationProps>) {
        const {
            id = 0,
            address = "",
            city = "",
            state = "",
            zipCode = "",
            name = "",
            details = "",
        } = props;

        this.id = id;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.name = name;
        this.details = details;
    }

    public static fromDatabase(props: {
        id: number;
        address: string;
        city: string;
        state: string;
        zip_code: string;
        name: string;
        details: string;
    }) {
        const obj = new Location(props);
        obj.zipCode = props.zip_code;

        return obj;
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getAddress(): string {
        return this.address;
    }

    setAddress(address: string) {
        this.address = address;
    }

    getCity(): string {
        return this.city;
    }
    setCity(city: string) {
        this.city = city;
    }

    getState(): string {
        return this.state;
    }
    setstate(state: string) {
        this.state = state;
    }

    getZipCode(): string {
        return this.zipCode;
    }
    setZipCode(zipCode: string) {
        this.zipCode = zipCode;
    }

    getName(): string {
        return this.name;
    }
    setName(name: string) {
        this.name = name;
    }

    getDetails(): string {
        return this.details;
    }
    setDetails(details: string) {
        this.details = details;
    }
}
