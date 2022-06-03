export abstract class User {
    protected authId!: number;
    protected firstName!: string;
    protected lastName!: string;
    // protected emailAddress!: string;
    // protected password!: string;
    // protected role!: string;
    // protected universityId!: number;

    public abstract get $authId(): number;
    public abstract set $authId(value: number);

    abstract get $firstName(): string;
    abstract set $firstName(value: string);

    public abstract get $lastName(): string;
    abstract set $lastName(value: string);

    // abstract get $emailAddress(): string;
    // abstract set $emailAddress(value: string);

    // abstract get $password(): string;
    // abstract set $password(value: string);

    // abstract get $role(): string;
    // abstract set $role(value: string);

    // abstract get $universityId(): number;
    // abstract set $universityId(value: number);
}
