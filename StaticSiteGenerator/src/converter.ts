import { Project } from "./model";
import { Style } from "./style";
import { Theme } from "./theme";

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

export function convertFile(project: Project, fileIndex: number): string {
    throw new Error("Not implemented");
}

export function convertProject(project: Project): string {
    throw new Error("Not implemented");
}