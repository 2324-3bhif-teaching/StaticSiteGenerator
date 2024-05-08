import {Style} from "./style";

export class Theme {
    public static readonly DefaultName : string  = "Default";
    private readonly _isPublic: boolean;
    private readonly _userName: string;
    private readonly _name: string;

    private readonly _styles: Map<string, Style[]>;

    constructor(userName: string, name: string, isPublic: boolean) {
        this._userName = userName;
        this._name = name;
        this._isPublic = isPublic;
        this._styles = new Map<string, Style[]>();
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
    
    public addStyle(selector: string, ...style: Style[]): void {
        if(style.length == 0){
            throw new Error("Style cannot be empty");
        }
        if(this.checkStyle(selector))
        {
            this._styles.set(selector, this._styles.get(selector)!.concat(style));
            return;
        }
        this._styles.set(selector, style);
    }

    private checkStyle(selector:string):boolean
    {
        return (this._styles.has(selector) && this._styles.get(selector) != undefined)
    }

    public getStyles(): Map<string, Style[]> {
        return this._styles;
    }

    public toString(): string {
        return `not implemented`;
    }
}