import { Theme } from "./services/themeService"
import {join} from "path";
import {ElementStyleData} from "./services/elementStyleService";
import { StyleData } from "./services/styleService";

export const FileLocation: string = 'data';
export const TempFileLocation: string = join(FileLocation, 'temp');

export const DefaultTheme: Theme = {
    id: 1,
    name: 'Default',
    userName: 'SSG',
    isPublic: true
};

export const DefaultElementStyles: ElementStyleData[] = [
    { selector: 'h2', themeId: 1 },
    { selector: 'p', themeId: 1 }
];

export const DefaultStyles: StyleData[] = [
    { property: 'color', value: 'red', elementStyleId: 1 },
    { property: 'color', value: 'blue', elementStyleId: 2 }
];