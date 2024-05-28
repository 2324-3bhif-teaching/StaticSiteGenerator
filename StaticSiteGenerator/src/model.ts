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