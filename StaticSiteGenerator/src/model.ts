import {Theme} from "./theme";

export interface File {
    index: number,
    path: string
}

export interface Project {
    name: string,
    theme: Theme,
    files: File[]
}

export interface User {
    name: string,
    password: string,
    themes: Theme[],
    projects: Project[]
}