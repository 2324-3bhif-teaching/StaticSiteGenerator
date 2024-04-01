
export interface File {
    index: number;
    path: string;
}

export interface Project {
    name: string;
    theme: Theme;
    files: File[];
}

export class Style {

    private property: string;
    private value: string;

    constructor(property: string, value: string) {
        this.property = property;
        this.value = value;
    }

    public toString(): string {
        return `${this.property}: ${this.value}`;
    }
}

export interface User {
    name: string;
    password: string;
    themes: Theme[];
    projects: Project[];
}

export interface Theme {
    isPublic: boolean,
    userName: string,
    name: string
}