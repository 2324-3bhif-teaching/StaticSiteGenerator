import {Style} from "./style";

export class Theme {
    private readonly _isPublic: boolean;
    private readonly _userName: string;
    private readonly _name: string;

    constructor(userName: string, name: string, isPublic: boolean) {
        this._userName = userName;
        this._name = name;
        this._isPublic = isPublic;
    }

    public get isPublic(): boolean {
        return this._isPublic;
    }

    public get userName(): string {
        return this._userName;
    }

    public get name(): string {
        return this._name;
    }

    public getStyles(): Map<string, Style[]> {
        return new Map<string, Style[]>();
    }

    public toString(): string {
        return `not implemented`;
    }
}