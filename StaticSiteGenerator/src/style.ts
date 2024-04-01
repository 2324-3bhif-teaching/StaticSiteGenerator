export class Style {

    private readonly _property: string;
    private readonly _value: string;

    constructor(property: string, value: string) {
        this._property = property;
        this._value = value;
    }

    public get property(): string {
        return this._property;
    }

    public get value(): string {
        return this._value;
    }

    public toString(): string {
        return `${this._property}: ${this._value}`;
    }
}