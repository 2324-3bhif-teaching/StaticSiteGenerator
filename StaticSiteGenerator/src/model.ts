import {Theme} from "./theme";

export interface File {
    id: number,
    index: number,
    path: string,
    projId: number
}

export interface Project {
    id: number
    name: string,
    theme: Theme
}