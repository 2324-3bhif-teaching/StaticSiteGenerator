import { DefaultTheme } from "../../src/constants";
import { Unit } from "../../src/database/unit";
import { ElementStyle, ElementStyleData, ElementStyleService } from "../../src/services/elementStyleService";
import { ThemeData, ThemeService } from "../../src/services/themeService";
import { setupTestData } from "../database/testData";

const testElementStyleData: ElementStyleData[] = [
    {selector: "body", themeId: 1},
    {selector: "div > h1", themeId: 1},
    {selector: "body > h1:first-child, body > div > h1:first-child", themeId: 1},
    {selector: "*", themeId: 1},
    {selector: "h1", themeId: 1}
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
            }, false, true);
        });

        test("should not insert with empty selector", async () => {
            async function expectThrow(elementStyle: ElementStyleData){
                await execute(async (service: ElementStyleService) => {
                    expect(async () => {
                        await service.insertElementStyle(elementStyle);
                    }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_ElementStyle_Selector');
                }, false, false);
            };
            
            const elementStyle: ElementStyleData = {
                selector: "",
                themeId: 1
            };
            await expectThrow(elementStyle);
            elementStyle.selector = "    ";
            await expectThrow(elementStyle);
        });

        test("should not insert with nonexisting themeId", async () => {
            await execute(async (service: ElementStyleService) => {
                expect(async () => {
                    await service.insertElementStyle(
                        {
                            selector: "*",
                            themeId: 2
                        });
                }).rejects.toThrow('SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
            }, false, false);
        });
    });

    describe("selectAllElementStyles", () => {
        test("should select all", async () => {
            await execute(async (service: ElementStyleService) => {
                for(const data of testElementStyleData){
                    await service.insertElementStyle(data);
                }
            }, false, true);

            await execute(async (service: ElementStyleService) => {
                const selected: ElementStyle[] = await service.selectAllElementStyles(DefaultTheme.id);
                expect(selected.length).toBe(testElementStyleData.length);
                for(let i: number = 0; i < selected.length; i++){
                    expect(selected[i].selector).toBe(testElementStyleData[i].selector);
                    expect(selected[i].themeId).toBe(testElementStyleData[i].themeId);
                }
            }, true);
        });
    });

    describe("updateElementStyle", () => {
        test("should update selector", async () => {
            const data: ElementStyleData = {
                selector: "*",
                themeId: 1
            };
            const newSelector: string = "h1";

            await execute( async (service: ElementStyleService) => {
                await service.insertElementStyle(data);
            }, false, true);

            await execute( async (service: ElementStyleService) => {
                const rs: boolean = await service.updateElementStyle(newSelector, 1);
                expect(rs).toBeTruthy();
            }, false, true);

            await execute( async (service: ElementStyleService) => {
                const selected: ElementStyleData[] = await service.selectAllElementStyles(1);
                expect(selected.length).toBe(1);
                expect(selected[0].selector).toBe(newSelector);
            }, true);
        });

        test("should not update to empty selector", async () => {
            async function expectThrow(newSelector: string){
                await execute( async (service: ElementStyleService) => {
                    expect( async () => {
                        await service.updateElementStyle(newSelector, 1);
                    }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_ElementStyle_Selector');
                }, false, false);
            }
            
            const data: ElementStyleData = {
                selector: "*",
                themeId: 1
            };

            await execute( async (service: ElementStyleService) => {
                await service.insertElementStyle(data);
            }, false, true);

            await expectThrow("");
            await expectThrow("    ");
        });
    });

    describe("deleteElementStyle", () => {
        test("should delete element style", async () => {
            const data: ElementStyleData = {
                selector: "*",
                themeId: 1
            };

            await execute( async (service: ElementStyleService) => {
                await service.insertElementStyle(data);
            }, false, true);

            await execute( async (service: ElementStyleService) => {
                const rs: boolean = await service.deleteElementStyle(1);
                expect(rs).toBeTruthy();
            }, false, true);

            await execute( async (service: ElementStyleService) => {
                const selected: ElementStyleData[] = await service.selectAllElementStyles(1);
                expect(selected.length).toBe(0);
            }, true);
        });
    });
});

async function execute(exe: (service: ElementStyleService) => Promise<void>, readonly: boolean, commit: boolean | null = null){
    const unit: Unit = await Unit.create(readonly);
    try{
        const service: ElementStyleService = new ElementStyleService(unit);
        await exe(service);
        commit === null ? await unit.complete() : await unit.complete(commit);
    }
    catch(error){
        commit === null ? await unit.complete() : await unit.complete(false);
    }
}