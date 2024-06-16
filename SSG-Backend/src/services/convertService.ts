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
import { wrap } from "module";

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

    public async convertProject(projectId: number, themeId: number, destinationPath: string, generateTOC : boolean = true): Promise<void> {
        const projectService: ProjectService = new ProjectService(this.unit);
        const projectPath: string | null = await projectService.getProjectPath(projectId);
        if (projectPath === null) {
            return;
        }

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

        let toc = "";

        if(generateTOC){
            toc = await this.createTableOfContent(projectId);
            archive.append(toc + `<link rel="stylesheet" href="style.css">` , {name: `index.html`});
        }
    

        for (const file of files) {
            archive.append(toc + await this.convertFile(file.id, false), {name: `${basename(file.name, ".adoc")}.html`});
        }

        

        archive.append(await this.convertThemeToCss(themeId), {name: "style.css"});
    
        await archive.finalize();
        await new Promise((resolve, reject) => {
            outputStream.on('finish', resolve);
            outputStream.on('error', reject);
        });
    }

    public async createTableOfContent(projectId: number): Promise<string> {
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
            const ids: string[] = this.getIdArray(fileContent);

            const html: string = this.generateHeaders(headers, ids, file.name, 1, 0);
    
            const fileLink = this.wrapInTag(file.name, "a", `href="${basename(file.name, ".adoc")}.html" class="file-link"`);
            wrapped = this.wrapInTag(fileLink, "li", 'class="navbar"') + this.wrapInTag(html, "ul", 'class="content-list"');
            resultingHtml += wrapped;
        }
        return this.wrapInTag(resultingHtml, "ul", 'id="table-of-contents" class="table-of-contents"');
    }

    private wrapInTag(input: string, tag: string, attributes: string = ''): string {
        return input !== "" ? `<${tag} ${attributes.trim()}>${input}</${tag}>` : "";
    };

    // soll rekursiv die li und ul machen;
    // soll bei 1 starten und erhäht sich dann rekursiv und geht so jedes level durch
    private generateHeaders(headers: string[], ids: string[], fileName: string, headerLevel: number, startIdx: number): string{
        const length: number = Math.min(headers.length, ids.length);
        let html: string = "";
        console.log("");
        console.log(`headerLevel: ${headerLevel} startIdx: ${startIdx}`);

        for(let i: number = startIdx; i < length; i++){
            const level = headers[i].split(" ")[0].length;
            const headerText = headers[i].replace(/^=+ /, '');
            const headerLink = this.wrapInTag(headerText, "a", `href="${basename(fileName, ".adoc")}.html#${ids[i]}" class="link"`);

            if(level === headerLevel){
                html += this.wrapInTag(headerLink, "li", 'class="content-list"');
                console.log(`content: ${html}`);
                html += this.wrapInTag(this.generateHeaders(headers, ids, fileName, headerLevel + 1, i + 1), "ul", 'class="sub-list"');
            }
            else if(level < headerLevel){
                console.log(`Broke out of ${headerLevel}`);
                break;
            }
        }
        return html;
    }

    private getIdArray(fileContent: string): string[]{
        const ids: string[] = [];
        const regex: RegExp = /^=+ +(\S+[\S ]*)$/mg;
        const h1Regex: RegExp = /^= +(\S+[\S ]*)$/mg;
        const h1Count: number | undefined = fileContent.match(h1Regex)?.length;
        let firstHeaderAssigned: boolean = false;
        for(const line of fileContent.split(/\r?\n/)){
            const match: RegExpMatchArray[] = [...line.matchAll(regex)];
            
            if(line.match(h1Regex) && !firstHeaderAssigned/*&& h1Count === 1*/){
                    ids.push("header");
                    firstHeaderAssigned = true;
            }
            else if(match.at(0)?.at(1)){
                ids.push(`_${match.at(0)?.at(1)?.toString().
                    replace(/ ?[^\s\wÄÜÖ=:.] ?/g, "").
                    replace(/[:.]/g, " ").
                    replace(/ +/g, "_").
                    toLowerCase()}`);
            }
        }
    
        let resultIds: string[] = ids;
        for(const searchId of ids){
            const occurences: string[] = ids.filter(id => id === searchId);
            if(occurences.length > 1){
                resultIds = this.handleSameIds(ids, searchId);
            }
        }
        return resultIds;
    }

    private handleSameIds(ids: string[], searchId: string): string[]{
        let counter: number = 0;
        for(let i: number = 0; i < ids.length; i++){
            if(ids[i] === searchId){
                counter++;
                if(counter > 1){
                    ids[i] = `${ids[i]}_${counter}`;
                }
            }
        }
        return ids;
    }
    
    private getArrayOfAllHeaders(fileContent: string): string[] {
        const lines: string[] = fileContent.split(/\r?\n/);
        const headers: string[] = [];
        const equalRegex = /^=+$/;
        for (const line of lines) {
            if (line.startsWith("=") && !equalRegex.test(line)) { 
                headers.push(line.replace(/-{2}/g, "-"));
            }
        }
    
        return headers;
    }
}