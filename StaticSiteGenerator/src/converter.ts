import { readFile } from "fs/promises";
import { Project } from "./model";
import { Style } from "./style";
import { Theme } from "./theme";
import Asciidoctor from 'asciidoctor';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from "path";
import { FileService } from "./services/fileService";
import { Unit } from "./database/unit";

const asciidoctorInstance = Asciidoctor();


export function generateCss(theme: Theme): string {
    const styles = theme.getStyles();

    let outputCss: string = "";

    styles.forEach((value: Style[], key: string) => {


        let elementCss = `${key} {`;
        value.forEach((style: Style) => {
            elementCss += `${style.toString()}`;
        });
        elementCss += "}";

        outputCss += elementCss;
    });

    return outputCss;
}

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