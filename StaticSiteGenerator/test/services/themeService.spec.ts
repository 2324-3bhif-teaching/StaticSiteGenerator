import {ThemeService} from "../../src/services/themeService";
import {setupTestData} from "../testData";
import {Unit} from "../../src/database/unit";
import {Theme} from "../../src/services/themeService";

const testThemes: Theme[] = [
    {userName: "user1", name: "theme1", isPublic: 1},
    {userName: "user1", name: "theme2", isPublic: 0},
    {userName: "user2", name: "theme1", isPublic: 1},
    {userName: "user2", name: "theme2", isPublic: 0}
];

describe("ThemeService", () => {
    beforeAll(async () => {
        await setupTestData();
    });

    describe("createTheme", () => {
        for (const theme of testThemes) {
            test(`should create theme ${theme.name} for user ${theme.userName}`, async () => {
                const unit = await Unit.create(false);
                const service = new ThemeService(unit);
                const result = await service.createTheme(theme);
                await unit.complete(true);
                expect(result).toBe(true);
            });
        }
    });

    describe("getPublicThemes", () => {
        test('should return all public themes', async () => {
            const unit = await Unit.create(true);
            const service = new ThemeService(unit);
            const themes: Theme[] = await service.getPublicThemes();
            await unit.complete();

            expect(themes).toEqual(testThemes.filter(t => t.isPublic === 1));
        });
    });

    describe("getThemesByUser", () => {
        const users: string[] = ["user1", "user2"];
        for (const user of users) {
            test(`should return all themes for user ${user}`, async () => {
                const unit = await Unit.create(true);
                const service = new ThemeService(unit);
                const themes: Theme[] = await service.getThemesByUser(user);
                await unit.complete();

                expect(themes).toEqual(testThemes.filter(t => t.userName === user));
            });
        }
    });

    describe("getTheme", () => {
        for (const theme of testThemes) {
            test(`should return theme ${theme.name} for user ${theme.userName}`, async () => {
                const unit = await Unit.create(true);
                const service = new ThemeService(unit);
                const result = await service.getTheme(theme.userName, theme.name);
                await unit.complete();

                expect(result).toEqual(theme);
            });
        }
    });
});