
export interface File {
    index: number;
    path: string;
}

export interface Project {
    name: string;
    theme: Theme;
    files: File[];
}

export interface Style {
    property: string;
    value: string;
}

export interface User {
    name: string;
    password: string;
    themes: Theme[];
    projects: Project[];
}


export interface Theme {
    isPublic: boolean;
    stylesheet: Map<string, Style[]>;
}