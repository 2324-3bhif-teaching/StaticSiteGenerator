import Asciidoctor from "asciidoctor";
import {Unit} from "../database/unit";
import {ServiceBase} from "../database/serviceBase";
import {ElementStyle, ElementStyleService} from "./elementStyleService";
import {StyleService} from "./styleService";
import {Style} from "./styleService";

export class ConvertService extends ServiceBase {
    //private _asciidoctorInstance: any = Asciidoctor();

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
}


/*
export async function convertFile(fileId: number): Promise<void> {
    const unit = await Unit.create(true);
    const fileService = new FileService(unit);

    const file = await fileService.getFilePath(fileId);

    if (file === undefined) {
        throw new Error("File not found");
    }

    const content = await readFile(file, "utf-8");

    asciidoctorInstance.convert(content,
        {
            to_file: path.basename(file) + `.html`,
            to_dir: path.dirname(file),
            attributes: {
                'stylesheet': `./${path.basename(file)}.css`,
                'copycss': true,
                'source-highlighter': 'highlight.js'
            }
        }
    );

    await fsPromises.appendFile(path.dirname(file)+ path.basename(file) + `.html`, `<style> .hljs{ background:transparent;}</style>`);

}

export async function convertProject(userName:string,project: Project): Promise<string[]> {
    let content: string[] = [];

    const unit = await Unit.create(true);
    const fileService = new FileService(unit);

    (await fileService.selectFilesOfProject(userName,project.id)).forEach(file =>{
        convertFile(file.id);
    });


    return content;
}
 */