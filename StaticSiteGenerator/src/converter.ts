import { readFile } from "fs/promises";
import { Project } from "./model";
import { Style } from "./style";
import { Theme } from "./theme";
import Asciidoctor from 'asciidoctor';

const asciidoctorInstance = Asciidoctor();


export function generateCss(theme: Theme): string {
    const styles = theme.getStyles();

    let outputCss : string = "";

    styles.forEach((value : Style[], key : string) => {
        let elementCss = `.${key} {`;
        value.forEach((style : Style) => {
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

    const converted = asciidoctorInstance.convert(content).toString();
    return converted;
}

export function convertProject(project: Project): string {
    let content = "";

    project.files.forEach(async (file) => {
        content += await convertFile(project, file.index);
    });

    return content;
}