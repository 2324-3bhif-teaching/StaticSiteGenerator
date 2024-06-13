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

    public async convertProject(projectId: number, themeId: number, destinationPath: string): Promise<void> {
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
    
        for (const file of files) {
            archive.append(await this.convertFile(file.id, false), {name: `${basename(file.name, "adoc")}html`});
        }
        archive.append(await this.convertThemeToCss(themeId), {name: "style.css"});
    
        await archive.finalize();
        await new Promise((resolve, reject) => {
            outputStream.on('finish', resolve);
            outputStream.on('error', reject);
        });
    }
}