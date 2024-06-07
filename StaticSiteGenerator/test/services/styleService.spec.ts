import { Unit } from "../../src/database/unit";
import { StyleService, StyleData, Style } from "../../src/services/styleService";
import { setupTestData } from "../database/testData";

const testStyles: StyleData[] = [
    {property: "font-size", value: "20px", elementStyleId: 2},
    {property: "font-family", value: "sans-serif", elementStyleId: 1},
    {property: "margin", value: "0", elementStyleId: 1},
    {property: "text-decoration", value: "none", elementStyleId: 2},
    {property: "border-radius", value: "0.5em", elementStyleId: 1}
];

describe("Style Service", () => {
    beforeEach(async () => {
        await setupTestData();
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
                    }).toThrow("SQLITE_CONSTRAINT: UNIQUE constraint failed: Style.property");
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
                    }).toThrow('SQLITE_CONSTRAINT: UNIQUE constraint failed: Style.value');
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

        test("should not insert with nonexisting element style id");
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
    const styleService: StyleService = new StyleService(unit);
    await exe(styleService);
    await unit.complete(commit);
}