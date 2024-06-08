import {ThemeData, ThemeService} from "../../src/services/themeService";
import {setupTestData} from "../database/testData";
import {Unit} from "../../src/database/unit";
import {Theme} from "../../src/services/themeService";

const testThemeData: ThemeData[] = [
    {userName: "user1", name: "theme1", isPublic: true},
    {userName: "user1", name: "theme2", isPublic: false},
    {userName: "user2", name: "theme1", isPublic: true},
    {userName: "user2", name: "theme2", isPublic: false}
];

const testThemes: Theme[] = [
    {id: 1, userName: "user1", name: "theme1", isPublic: true},
    {id: 2, userName: "user1", name: "theme2", isPublic: false},
    {id: 3, userName: "user2", name: "theme1", isPublic: true},
    {id: 4, userName: "user2", name: "theme2", isPublic: false}
];

describe("ThemeService", (): void => {
    beforeAll(async (): Promise<void> => {
        await setupTestData();
    });

    describe("insertTheme", (): void => {
        for (const theme of testThemeData) {
            test(`should create theme ${theme.name} for user ${theme.userName}`, async () => {
                const unit: Unit = await Unit.create(false);
                const service: ThemeService = new ThemeService(unit);
                const result: boolean = await service.insertTheme(theme);
                await unit.complete(true);
                expect(result).toBe(true);
            });
        }
        test('should not create duplicate theme', async () => {
            const unit: Unit = await Unit.create(false);
            const service: ThemeService = new ThemeService(unit);
            await expect(async (): Promise<void> => {await service.insertTheme(testThemes[0])})
                .rejects.toThrow('SQLITE_CONSTRAINT: UNIQUE constraint failed: Theme.name, Theme.user_name');
            await unit.complete(true);
        });
        test('should not create with invalid userName', async () => {
            const unit: Unit = await Unit.create(false);
            const service: ThemeService = new ThemeService(unit);
            await expect(async (): Promise<void> => {
                await service.insertTheme({userName: "", name: "theme", isPublic: false})
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Theme_User_Name');
            await expect(async (): Promise<void> => {
                await service.insertTheme({userName: "   ", name: "theme", isPublic: false})
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Theme_User_Name');
            await unit.complete(true);
        });
        test('should not create with invalid name', async () => {
            const unit: Unit = await Unit.create(false);
            const service: ThemeService = new ThemeService(unit);
            await expect(async (): Promise<void> => {
                await service.insertTheme({userName: "user1", name: "", isPublic: false})
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Theme_Name');
            await expect(async (): Promise<void> => {
                await service.insertTheme({userName: "user1", name: "   ", isPublic: false})
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Theme_Name');
            await unit.complete(true);
        });
    });

    describe("selectPublicThemes", () => {
        test('should return all public themes', async () => {
            const unit: Unit = await Unit.create(true);
            const service: ThemeService = new ThemeService(unit);
            const themes: Theme[] = await service.selectPublicThemes();
            await unit.complete();

            expect(themes).toEqual(testThemes.filter(t => t.isPublic));
        });
    });

    describe("selectThemesByUser", () => {
        const users: string[] = ["user1", "user2"];
        for (const user of users) {
            test(`should return all themes for user ${user}`, async () => {
                const unit: Unit = await Unit.create(true);
                const service: ThemeService = new ThemeService(unit);
                const themes: Theme[] = await service.selectThemesByUser(user);
                await unit.complete();

                expect(themes).toEqual(testThemes.filter(t => t.userName === user));
            });
        }
    });

    describe("updateThemeName", () => {
        test('should update theme name', async () => {
            const unit: Unit = await Unit.create(false);
            const service: ThemeService = new ThemeService(unit);
            const newName: string = "newName";
            const result: boolean = await service.updateThemeName(testThemes[0].userName, 1, newName);
            await unit.complete(true);
            expect(result).toBeTruthy();
        });
        test('should not update non-existing theme', async () => {
            const unit: Unit = await Unit.create(false);
            const service: ThemeService = new ThemeService(unit);
            const result: boolean = await service.updateThemeName("user1", -1, "newName");
            await unit.complete(true);
            expect(result).toBeFalsy();
        });
        test('should not update with invalid name', async () => {
            const unit: Unit = await Unit.create(false);
            const service: ThemeService = new ThemeService(unit);
            await expect(async (): Promise<void> => {
                await service.updateThemeName(testThemes[0].userName, 1, "")
            }).rejects.toThrow('SQLITE_CONSTRAINT: CHECK constraint failed: CK_Theme_Name');
            await unit.complete(true);
        });
    });

    describe("updateThemePublic", () => {
        test('should update theme public', async () => {
            const unit: Unit = await Unit.create(false);
            const service: ThemeService = new ThemeService(unit);
            const result: boolean = await service.updateThemePublic(testThemes[0].userName, 1, false);
            await unit.complete(true);
            expect(result).toBeTruthy();
        });
        test('should not update non-existing theme', async () => {
            const unit: Unit = await Unit.create(false);
            const service: ThemeService = new ThemeService(unit);
            const result: boolean = await service.updateThemePublic("user1", -1, false);
            await unit.complete(true);
            expect(result).toBeFalsy();
        });
    });

    describe("deleteTheme", () => {
        test('should delete theme', async () => {
            const unit: Unit = await Unit.create(false);
            const service: ThemeService = new ThemeService(unit);
            const result: boolean = await service.deleteTheme(testThemes[2].userName, 3);
            await unit.complete(true);
            expect(result).toBeTruthy();
        });
        test('should not delete non-existing theme', async () => {
            const unit: Unit = await Unit.create(false);
            const service: ThemeService = new ThemeService(unit);
            const result: boolean = await service.deleteTheme("user1", -1);
            await unit.complete(true);
            expect(result).toBeFalsy();
        });
    });

    describe("database changes", () => {
        test('no more public themes', async () => {
            const unit: Unit = await Unit.create(true);
            const service: ThemeService = new ThemeService(unit);
            const themes: Theme[] = await service.selectPublicThemes();
            await unit.complete();

            expect(themes).toEqual([]);
        });
        test('theme name and isPublic update', async () => {
            const unit: Unit = await Unit.create(true);
            const service: ThemeService = new ThemeService(unit);
            const themes: Theme[] = await service.selectThemesByUser(testThemes[0].userName);
            await unit.complete();

            expect(themes[0]).toEqual({id: 1, userName: testThemes[0].userName, name: "newName", isPublic: false});
        });
    });

    describe("ownsTheme", () => {
        test('should own theme', async () => {
            const unit: Unit = await Unit.create(true);
            const service: ThemeService = new ThemeService(unit);
            const result: boolean = await service.ownsTheme(testThemes[0].userName, 1);
            await unit.complete();
            expect(result).toBeTruthy();
        });
        test('should not own non-existing theme', async () => {
            const unit: Unit = await Unit.create(true);
            const service: ThemeService = new ThemeService(unit);
            const result: boolean = await service.ownsTheme(testThemes[0].userName, -1);
            await unit.complete();
            expect(result).toBeFalsy();
        });
        test('should not own theme of other user', async () => {
            const unit: Unit = await Unit.create(true);
            const service: ThemeService = new ThemeService(unit);
            const result: boolean = await service.ownsTheme(testThemes[0].userName, 3);
            await unit.complete();
            expect(result).toBeFalsy();
        });
    });

    describe("isAllowedToUseTheme", () => {
        test('should allow user to use theme', async () => {
            const unit: Unit = await Unit.create(true);
            const service: ThemeService = new ThemeService(unit);
            const result: boolean = await service.isAllowedToUseTheme(testThemes[0].userName, 1);
            await unit.complete();
            expect(result).toBeTruthy();
        });
        test('should allow user to use public theme', async () => {
            const unit: Unit = await Unit.create(true);
            const service: ThemeService = new ThemeService(unit);
            await service.updateThemePublic(testThemes[2].userName, 4, true);
            const result: boolean = await service.isAllowedToUseTheme(testThemes[0].userName, 4);
            await unit.complete();
            expect(result).toBeTruthy();
        });
        test('should not allow user to use non-existing theme', async () => {
            const unit: Unit = await Unit.create(true);
            const service: ThemeService = new ThemeService(unit);
            const result: boolean = await service.isAllowedToUseTheme(testThemes[0].userName, -1);
            await unit.complete();
            expect(result).toBeFalsy();
        });
        test('should not allow user to use theme of other user', async () => {
            const unit: Unit = await Unit.create(true);
            const service: ThemeService = new ThemeService(unit);
            await service.updateThemePublic(testThemes[2].userName, 4, false);
            const result: boolean = await service.isAllowedToUseTheme(testThemes[0].userName, 4);
            await unit.complete();
            expect(result).toBeFalsy();
        });
    });
});