import { throws } from "assert";
import {convertFile, convertProject, generateCss } from "../src/converter";
import { Theme } from "../src/theme";
import { Style } from "../src/style";
import { Project } from "../src/model";
import { readFileSync } from "fs";

describe("convertFile ", () => {

    test('should throw not implemented', () => {
        const project : Project = {name: "test", theme: new Theme("test","TestTheme",false), files: [{index: 0, path: "./test.adoc"}]};


    });

});


describe("convertProject ", () => {

    test('should throw not implemented', () => {

    });

});

describe("generateCss ", () => {

    test('should receive expected output', () => {
        const theme = new Theme("test","TestTheme",false);

        theme.addStyle("paragraph", new Style("color", "red"));
        theme.addStyle("paragraph", new Style("opacity", "50%"));
        theme.addStyle("paragraph", new Style("font-size", "12px"), new Style("font-family", "Arial"));

        const css = generateCss(theme);
        expect(css).toBe(`.paragraph {color: red;opacity: 50%;font-size: 12px;font-family: Arial;}`);
    });

});