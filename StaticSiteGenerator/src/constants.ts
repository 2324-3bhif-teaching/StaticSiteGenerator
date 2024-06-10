import { Theme } from "./services/themeService"
import {join} from "path";

export const FileLocation: string = 'data';
export const TempFileLocation: string = join(FileLocation, 'temp');

export const DefaultTheme: Theme = {
    id: 1,
    name: 'Default',
    userName: 'SSG',
    isPublic: true
};