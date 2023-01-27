import { Gender, Role, Status, Visibility } from "../utilities/enums";
import { Player } from "./Player";

export class TestPlayer extends Player {
    protected gender: Gender;

    protected dob: Date;

    protected visibility: Visibility;

    protected graduationTerm: string;

    protected image: string;

    constructor(
        authId: string,
        firstName: string,
        lastName: string,
        language: string,
        emailAddress: string,
        role: Role,
        gender: Gender,
        dob: Date,
        visibility: Visibility,
        graduationTerm: string,
        image: string,
        status: Status,
        dateCreated: Date,
        organizationId: string
    ) {
        super(
            authId,
            firstName,
            lastName,
            language,
            emailAddress,
            role,
            gender,
            dob,
            visibility,
            graduationTerm,
            image,
            status,
            dateCreated,
            organizationId
        );

        this.gender = gender;
        this.dob = dob;
        this.visibility = visibility;
        this.graduationTerm = graduationTerm;
        this.image = image;
    }
}
