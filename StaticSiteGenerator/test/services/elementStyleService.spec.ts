import { DefaultTheme } from "../../src/constants";
import { Unit } from "../../src/database/unit";
import { ElementStyleData, ElementStyleService } from "../../src/services/elementStyleService";
import { ThemeData, ThemeService } from "../../src/services/themeService";
import { setupTestData } from "../database/testData";

const testElementStyleData: ElementStyleData[] = [
    {selector: "body", themeId: 1},
    {selector: "*", themeId: 1},
    {selector: "div > h1", themeId: 1},
    {selector: "h1", themeId: 1},
    {selector: "body > h1:first-child, body > div > h1:first-child", themeId: 1}
];

describe("ElementStyleService", () => {
    beforeEach( async () => {
        await setupTestData();

        const unit: Unit = await Unit.create(false);
        const themeService: ThemeService = new ThemeService(unit);
        await themeService.insertTheme({
            userName: DefaultTheme.userName,
            name: DefaultTheme.name,
            isPublic: DefaultTheme.isPublic
        });
        unit.complete(true);
    });

    describe("insertElementStyle", () => {
        test("should insert all", async () => {
            await execute(async (service: ElementStyleService) => {
                for(const elementStyle of testElementStyleData){
                    const rs: boolean = await service.insertElementStyle(elementStyle);
                    expect(rs).toBeTruthy();
                }
            }, true, true);
        });

        test("should not insert with empty selector", async () => {
            async function expectThrow(){
                await execute(async (service: ElementStyleService) => {
                    expect(async () => {
                        await service.insertElementStyle(elementStyle);
                    }).toThrow();
                }, false, false);
            };
            
            const elementStyle: ElementStyleData = {
                selector: "",
                themeId: 1
            };
        });
    });
});

async function execute(exe: (service: ElementStyleService) => Promise<void>, readonly: boolean, commit: boolean | null = null){
    const unit: Unit = await Unit.create(readonly);
    const service: ElementStyleService = new ElementStyleService(unit);
    await exe(service);
    await unit.complete(commit);
}