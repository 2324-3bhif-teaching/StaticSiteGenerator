import { DefaultTheme } from "../../src/constants";
import { Unit } from "../../src/database/unit";
import { ElementStyleData, ElementStyleService } from "../../src/services/elementStyleService";
import { StyleService, StyleData, Style } from "../../src/services/styleService";
import { ThemeService } from "../../src/services/themeService";
import { setupTestData } from "../database/testData";

const testStyles: StyleData[] = [
    {property: "font-size", value: "20px", elementStyleId: 2},
    {property: "font-family", value: "sans-serif", elementStyleId: 1},
    {property: "margin", value: "0", elementStyleId: 1},
    {property: "text-decoration", value: "none", elementStyleId: 2},
    {property: "border-radius", value: "0.5em", elementStyleId: 1}
];

const testElementStyleData: ElementStyleData[] = [
    {selector: "body", themeId: 1},
    {selector: "div > h1", themeId: 1}
];

describe("Style Service", () => {
    beforeEach(async () => {
        await setupTestData();
        const unit: Unit = await Unit.create(false);
        const elementStyleService: ElementStyleService = new ElementStyleService(unit);
        const themeService: ThemeService = new ThemeService(unit);
        await themeService.insertTheme({
            userName: DefaultTheme.userName,
            name: DefaultTheme.name,
            isPublic: DefaultTheme.isPublic
        });
        for(const data of testElementStyleData){
            await elementStyleService.insertElementStyle(data);
        }
        await unit.complete(true);
    });

    describe("insertStyle", () => {
        test("should insert style", async () => {
            await execute(async (styleService: StyleService) => {
                for(const testStyle of testStyles){
                    const rs: boolean = await styleService.insertStyle(testStyle);
                    expect(rs).toBeTruthy();
                }
            }, false, true);
        });

        test("should not insert empty property", async () => {
            async function expectThrow(style: StyleData):Promise<void> {
                await execute(async (sService: StyleService) => {
                    expect(async () => {
                        await sService.insertStyle(style);
                    }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Style_Property');
                }, false, false);
            }
            
            const style: StyleData = {
                property: "", 
                value: "20px", 
                elementStyleId: 2
            }

            await expectThrow(style);
            style.property = "   ";
            await expectThrow(style);
        });

        test("should not insert empty value", async () => {
            async function expectThrow(style: StyleData): Promise<void> {
                await execute(async (sService: StyleService) => {
                    expect(async () => {
                        await sService.insertStyle(style);
                    }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Style_Value');
                }, false, false);
            }

            const style: StyleData = {
                property: "font-size", 
                value: "", 
                elementStyleId: 2
            }

            await expectThrow(style);
            style.value = "   ";
            await expectThrow(style);
        });

        test("should not insert with nonexisting element style id", async () => {
            const style: StyleData = {
                property: "font-size", 
                value: "10px", 
                elementStyleId: 10
            }

            await execute(async (service: StyleService) => {
                expect(async () => {
                    await service.insertStyle(style);
                }).rejects.toThrow('SQLITE_CONSTRAINT: FOREIGN KEY constraint failed');
            }, false, false);
        });
    });
    
    describe("selectAll", () => {
        test("should select all", async () => {
            await execute(async (styleService: StyleService) => {
                for(const testStyle of testStyles){
                    await styleService.insertStyle(testStyle);
                }
            }, false, true);

            let styles1: Style[] = [];
            let styles2: Style[] = [];
            await execute(async (styleService: StyleService) => {
                styles1 = await styleService.selectAll(1);
                styles2 = await styleService.selectAll(2);
            }, true);
            
            const testStyles1: StyleData[] = testStyles.filter(style => style.elementStyleId === 1);
            const testStyles2: StyleData[] = testStyles.filter(style => style.elementStyleId === 2);
            expectToBeSame(styles1, testStyles1);
            expectToBeSame(styles2, testStyles2);
        });
    });

    describe("updateStyleProperty", () => {
        test("should update style property", async () => {
            const style: StyleData = {
                property: "margin", 
                value: "10px", 
                elementStyleId: 1
            };
            const newProperty: string = "padding";

            await execute(async (styleService: StyleService) => {
                await styleService.insertStyle(style);
            }, false, true);

            await execute(async (service: StyleService) => {
                const rs: boolean = await service.updateStyleProperty(1, newProperty);
                expect(rs).toBeTruthy();
            }, true, false);

            await execute(async (service: StyleService) => {
                const rs: Style[] = await service.selectAll(style.elementStyleId);
                expect(rs.length).toBe(1);
                expect(rs[0].property).toBe(newProperty);
                expect(rs[0].value).toBe(style.value);
                expect(rs[0].elementStyleId).toBe(style.elementStyleId);
            }, true);
        });

        test("should not update to empty property", async () => {
            async function expectThrow(newProperty: string){
                await execute(async (service: StyleService) => {
                    expect(async () => {
                        await service.updateStyleProperty(1, newProperty);
                    }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Style_Property');
                }, false, false);
            };
            
            const style: StyleData = {
                property: "margin", 
                value: "10px", 
                elementStyleId: 1
            };

            await execute(async (styleService: StyleService) => {
                await styleService.insertStyle(style);
            }, false, true);

            await expectThrow("");
            await expectThrow("   ");
        });
    });

    describe("updateStyleValue", () => {
        test("should update value", async () => {
            const style: StyleData = {
                property: "margin", 
                value: "10px", 
                elementStyleId: 1
            };
            const newValue: string = "20rem";

            await execute(async (service: StyleService) => {
                await service.insertStyle(style);
            }, false, true);

            await execute(async (service: StyleService) => {
                const rs: boolean = await service.updateStyleValue(1, newValue);
                expect(rs).toBeTruthy();
            }, false, true);

            await execute(async (service: StyleService) => {
                const rs: Style[] = await service.selectAll(1);
                expect(rs.length).toBe(1);
                expect(rs[0].property).toBe(style.property);
                expect(rs[0].value).toBe(style.value);
                expect(rs[0].elementStyleId).toBe(style.elementStyleId);
            }, true);
        });

        test("should not update to empty value", async () => {
            async function expectThrow(newValue: string){
                await execute(async (service: StyleService) => {
                    expect(async () => {
                        await service.updateStyleValue(1, newValue);
                    }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Style_Value');
                }, false, false);
            };
            
            const style: StyleData = {
                property: "margin", 
                value: "10px", 
                elementStyleId: 1
            };

            await execute(async (styleService: StyleService) => {
                await styleService.insertStyle(style);
            }, false, true);

            await expectThrow("");
            await expectThrow("   ");
        });
    });

    describe("deleteStyle", () => {
        test("should delete style", async () => {
            const style: StyleData = {
                property: "margin", 
                value: "10px", 
                elementStyleId: 1
            };

            await execute(async (styleService: StyleService) => {
                await styleService.insertStyle(style);
            }, false, true);

            await execute(async (service: StyleService) => {
                await service.deleteStyle(1);
            }, false, true);

            await execute(async (service: StyleService) => {
                const rs: Style[] = await service.selectAll(1);
                expect(rs.length).toBe(0);
            }, true);
        });

        test("should not delete nonexisting style", async () => {
            const style: StyleData = {
                property: "margin", 
                value: "10px", 
                elementStyleId: 1
            };

            await execute(async (styleService: StyleService) => {
                await styleService.insertStyle(style);
            }, false, true);

            await execute(async (service: StyleService) => {
                const rs: boolean = await service.deleteStyle(2);
                expect(rs).toBeFalsy();
            }, false, false);

            await execute(async (service: StyleService) => {
                const rs: Style[] = await service.selectAll(1);
                expect(rs.length).toBe(1);
                expect(rs[0].property).toBe(style.property);
                expect(rs[0].value).toBe(style.value);
                expect(rs[0].elementStyleId).toBe(style.elementStyleId);
            }, true);
        });
    });
});

function expectToBeSame(arr1: Style[], arr2: StyleData[]){
    expect(arr1.length).toBe(arr2.length);
    for(let i: number = 0; i < arr1.length; i++)
    {
        expect(arr1[i].property).toBe(arr2[i].property);
        expect(arr1[i].value).toBe(arr2[i].value);
        expect(arr1[i].elementStyleId).toBe(arr2[i].elementStyleId);
    }
}

async function execute(exe: (styleService: StyleService) => Promise<void>, readonly: boolean, commit: boolean | null = null): Promise<void>{
    const unit: Unit = await Unit.create(readonly);
    try{
        const styleService: StyleService = new StyleService(unit);
        await exe(styleService);
        commit === null ? await unit.complete() : await unit.complete(commit);
    }
    catch(error){
        commit === null ? await unit.complete() : await unit.complete(false);
    }
}