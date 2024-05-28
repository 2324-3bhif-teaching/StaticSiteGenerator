import { readFile } from "fs/promises";
import { Project } from "./model";
import { Style } from "./style";
import { Theme } from "./theme";
import Asciidoctor from 'asciidoctor';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from "path";
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

export async function convertFile(project: Project, fileIndex: number): Promise<string> {
    const file = project.files.find((file) => file.index === fileIndex);

    if (file === undefined) {
        throw new Error("File not found");
    }

    const content = await readFile(file.path, "utf-8");

    const dir = './output';

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }


    const converted = asciidoctorInstance.convert(content,
        {
            to_file: path.basename(file.path) + `.html`,
            to_dir: dir,
            attributes: {
                'stylesheet': `./${project.theme.name}.css`,
                'copycss': true,
                'source-highlighter': 'highlight.js'
            }
        }
    ).toString();

    const css = generateCss(project.theme);
    await fsPromises.writeFile(`./output/${project.theme.name}.css`, css);
    await fsPromises.appendFile(dir + "/" + path.basename(file.path) + `.html`, `<style> .hljs{ background:transparent;}</style>`);

    return converted;
}

export function convertProject(project: Project): string[] {
    let content: string[] = [];

    project.files.forEach(async (file) => {
        content.push(await convertFile(project, file.index));
    });

    return content;
}