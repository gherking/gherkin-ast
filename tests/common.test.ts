import {cloneArray, normalizeString, safeString, replaceAll, replaceArray} from "../src";

describe("Common", () => {
    describe("safeString", () => {
        test("should remove white spaces", () => {
            expect(safeString(" Hello\tWorld     !!!")).toEqual("_Hello_World____!!!");
        });
    });
});