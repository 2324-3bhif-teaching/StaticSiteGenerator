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
    { selector: '*', themeId: 1 },
    { selector: '.hljs', themeId: 1 },
    { selector: '.hljs-title', themeId: 1 },
    { selector: '.hljs-keyword', themeId: 1 },
    { selector: 'body', themeId: 1 },
    { selector: 'a', themeId: 1 },
    { selector: 'span', themeId: 1 },
    { selector: 'li', themeId: 1 },
    { selector: 'a:visited', themeId: 1 },
    { selector: 'h2', themeId: 1 }
];

export const DefaultStyles: StyleData[] = [
    { property: 'font-family', value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", elementStyleId: 1 },
    { property: 'font-optical-sizing', value: 'auto', elementStyleId: 1 },
    { property: 'font-weight', value: '500', elementStyleId: 1 },
    { property: 'font-style', value: 'normal', elementStyleId: 1 },
    { property: 'color', value: '#586069', elementStyleId: 1 },
    { property: 'padding', value: '16px', elementStyleId: 2 },
    { property: 'background', value: 'linear-gradient(to right, #e9e9e9, #ededed) !important', elementStyleId: 2 },
    { property: 'border-radius', value: '8px', elementStyleId: 2 },
    { property: 'color', value: '#0366d6 !important', elementStyleId: 3 },
    { property: 'margin-bottom', value: '8px', elementStyleId: 3 },
    { property: 'padding-left', value: '4px', elementStyleId: 3 },
    { property: 'color', value: '#d73a49 !important', elementStyleId: 4 },
    { property: 'padding', value: '2px', elementStyleId: 4 },
    { property: 'background', value: 'linear-gradient(to right, #f8f9fa, #e9ecef) !important', elementStyleId: 5 },
    { property: 'margin', value: '20px', elementStyleId: 5 },
    { property: 'padding', value: '20px', elementStyleId: 5 },
    { property: 'border-radius', value: '0.25rem', elementStyleId: 5 },
    { property: 'color', value: '#0366d6 !important', elementStyleId: 6 },
    { property: 'text-decoration', value: 'none', elementStyleId: 6 },
    { property: 'margin-right', value: '10px', elementStyleId: 6 },
    { property: 'color', value: '#586069 !important', elementStyleId: 7 },
    { property: 'padding', value: '2px', elementStyleId: 7 },
    { property: 'list-style-type', value: 'disc', elementStyleId: 8 },
    { property: 'margin-left', value: '20px', elementStyleId: 8 },
    { property: 'padding-bottom', value: '4px', elementStyleId: 8 },
    { property: 'color', value: '#6f42c1', elementStyleId: 9 },
    { property: 'color', value: '#0366d6', elementStyleId: 10 },
    { property: 'list-style-type', value: 'none', elementStyleId: 10 },
    { property: 'margin-top', value: '20px', elementStyleId: 10 },
    { property: 'margin-bottom', value: '10px', elementStyleId: 10 },
    { property: 'padding-left', value: '10px', elementStyleId: 10 }
];