import { throws } from "assert";
import { Style } from "../src/style"

describe("ToString", () => {
    test('should convert to correctly formatted string', () => {
        const style = new Style("color", "rgba(0,0,0,0)");

        expect(style.toString()).toStrictEqual("color: rgba(0,0,0,0);");
    });
})