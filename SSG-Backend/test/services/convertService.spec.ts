import {setupTestData} from "../database/testData";
import {ThemeService} from "../../src/services/themeService";
import {ElementStyleService} from "../../src/services/elementStyleService";
import {Unit} from "../../src/database/unit";
import {StyleService} from "../../src/services/styleService";
import {ConvertService} from "../../src/services/convertService";

describe('convertService', (): void => {
    beforeEach(async (): Promise<void> => {
        await setupTestData();

        const unit: Unit = await Unit.create(false);
        const themeService: ThemeService = new ThemeService(unit);

        await themeService.insertTheme({
            userName: "test",
            name: "testTheme",
            isPublic: true
        });

        await unit.complete(true);
    });

    test('convertThemeToCss', async () => {
        let unit: Unit = await Unit.create(false);
        const elementStyleService: ElementStyleService = new ElementStyleService(unit);
        const styleService: StyleService = new StyleService(unit);

        await elementStyleService.insertElementStyle({
            themeId: 1,
            selector: "body"
        });

        await styleService.insertStyle({
            elementStyleId: 1,
            property: "color",
            value: "red"
        });
        await styleService.insertStyle({
            elementStyleId: 1,
            property: "background-color",
            value: "blue"
        });

        await unit.complete(true);
        unit = await Unit.create(true);

        const convertService: ConvertService = new ConvertService(unit);

        const css: string = await convertService.convertThemeToCss(1);
        expect(css).toBe("body {color: red;background-color: blue;}");
    });
    test('convertThemeToCss elementStyle without style should be empty', async () => {
        let unit: Unit = await Unit.create(false);
        const elementStyleService: ElementStyleService = new ElementStyleService(unit);

        await elementStyleService.insertElementStyle({
            themeId: 1,
            selector: "body"
        });
        await unit.complete(true);
        unit = await Unit.create(true);

        const convertService: ConvertService = new ConvertService(unit);

        const css: string = await convertService.convertThemeToCss(1);
        expect(css).toBe("");
    });
});