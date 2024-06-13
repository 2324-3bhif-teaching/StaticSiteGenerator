import Asciidoctor from "asciidoctor";
import {Unit} from "../database/unit";
import {ServiceBase} from "../database/serviceBase";
import {ElementStyle, ElementStyleService} from "./elementStyleService";
import {StyleService} from "./styleService";
import {Style} from "./styleService";
import {FileService} from "./fileService";
import {ProjectService} from "./projectService";
import {File} from "./fileService";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import {WriteStream} from "fs";
import archiver, {Archiver} from "archiver";
import {basename, join} from "path";

export class ConvertService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }

    public async convertThemeToCss(themeId: number): Promise<string> {
        const elementStyleService: ElementStyleService = new ElementStyleService(this.unit);
        const styleService: StyleService = new StyleService(this.unit);

        let outputCss: string = "";
        const elementsStyles: ElementStyle[] = await elementStyleService.selectAllElementStyles(themeId)

        for (const elementStyle of elementsStyles) {
            const styles: Style[] = await styleService.selectAll(elementStyle.id);
            let hasContent: boolean = false;
            let elementStyleCss: string = `${elementStyle.selector} {`;
            for (const style of styles) {
                elementStyleCss += `${style.property}: ${style.value};`;
                hasContent = true;
            }
            elementStyleCss += "}";
            if (hasContent) {
                outputCss += elementStyleCss;
            }
        }

        return outputCss;
    }

    public async convertFile(fileId: number, standalone: boolean): Promise<string> {
        const fileService: FileService = new FileService(this.unit);

        const filePath: string | null = await fileService.getFilePath(fileId);

        if (filePath === null) {
            throw new Error("File not found");
        }

        let attributes: any = {
            'stylesheet!': false,
            'linkcss': false,
            'source-highlighter': 'highlight.js'
        };

        if (!standalone) {
            attributes = {
                'linkcss': true,
                'stylesheet': 'style.css',
                'source-highlighter': 'highlight.js'
            }
        }

        const asciidoctorInstance = Asciidoctor();
        return asciidoctorInstance.convertFile(filePath, {
            to_file: false,
            standalone: true,
            attributes: attributes
        }).toString();
    }

    public async convertProject(projectId: number, destinationPath: string): Promise<void> {
        const projectService: ProjectService = new ProjectService(this.unit);
        const projectPath: string | null = await projectService.getProjectPath(projectId);
        if (projectPath === null) {
            return;
        }
        await this.createTableOfContent(projectId);
        const fileService: FileService = new FileService(this.unit);
        const files: File[] = await fileService.selectFilesOfProject(projectId);
    
        const outputStream: WriteStream = fs.createWriteStream(join(__dirname, "/../..", destinationPath));
        const archive: Archiver = archiver('zip', {
            zlib: { level: 9 }
        });
    
        archive.on('error', (err) => {
            throw err;
        });
    
        outputStream.on('close', () => {
            console.log('Archived files successfully.');
        });
    
        archive.pipe(outputStream);
    
        for (const file of files) {
            archive.append(await this.convertFile(file.id, false), {name: `${basename(file.name, ".adoc")}.html`});
        }
        archive.append(await this.convertThemeToCss(projectId), {name: "style.css"});
    
        await archive.finalize();
        await new Promise((resolve, reject) => {
            outputStream.on('finish', resolve);
            outputStream.on('error', reject);
        });
    }

    public async createTableOfContent(projectId: number): Promise<string> {
        const wrapInTag = (input: string, tag: string, attributes: string = ''): string => {
            return `<${tag} ${attributes.trim()}>${input}</${tag}>`;
        };
    
        const projectService: ProjectService = new ProjectService(this.unit);
        const projectPath: string | null = await projectService.getProjectPath(projectId);
        if (projectPath === null) {
            throw new Error("File not found");
        }
        const fileService: FileService = new FileService(this.unit);
        const files: File[] = await fileService.selectFilesOfProject(projectId);
        let resultingHtml = "";
    
        for (const file of files) {
            let wrapped = "";
            const rawPath = await fileService.getFilePath(file.id);
    
            if (rawPath == null) {
                continue;
            }
    
            const path = join(__dirname, "/../..", rawPath);
            const fileContent = await fsPromises.readFile(path, "utf-8");
            const headers: string[] = this.getArrayOfAllHeaders(fileContent);
    
            let currentList = "";
            for (const header of headers) {
                const level = header.startsWith("== ") ? 2 : 1;
                const headerText = header.replace(/^=+ /, '');
                const headerLink = wrapInTag(headerText, "a", `href="#${encodeURIComponent(headerText)}"`);
                if (level === 1) {
                    if (currentList) {
                        wrapped += wrapInTag(currentList, "ul");
                        currentList = "";
                    }
                    wrapped += wrapInTag(headerLink, "li");
                } else if (level === 2) {
                    currentList += wrapInTag(headerLink, "li");
                }
            }
            if (currentList) {
                wrapped += wrapInTag(currentList, "ul");
            }
    
            const fileLink = wrapInTag(file.name, "a", `href="${basename(file.name, ".adoc")}.html"`);
            wrapped = wrapInTag(fileLink, "li") + wrapInTag(wrapped, "ul");
            resultingHtml += wrapped;
        }
    
        console.log(resultingHtml);
        return wrapInTag(resultingHtml, "ul");
    }
    
    private getArrayOfAllHeaders(fileContent: string): string[] {
        const lines: string[] = fileContent.split(/\r?\n/);
        const headers: string[] = [];
        const equalRegex = /^=+$/;
        for (const line of lines) {
            if (line.startsWith("=") && !equalRegex.test(line)) { 
                headers.push(line);
            }
        }
    
        return headers;
    }
}