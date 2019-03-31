import { safeString, normalizeString, replaceAll } from "../src";

describe("safeString", () => {
    test("should remove white spaces", () => {
        expect(safeString(" Hello\tWorld     !!!")).toEqual("_Hello_World_____!!!");
    });
});

describe("normalizeString", () => {
    test("should trim lines", () => {
        expect(normalizeString("  line1  \n  line2  \n    \n  line3")).toEqual("line1\nline2\n\nline3");
    });
});

describe("replaceAll", () => {
    test("should replace all regex", () => {
        expect(replaceAll("Hello World!", /o/g, "X")).toEqual("HellX WXrld!");
    });
    test("should replace all string", () => {
        expect(replaceAll("Hello World!", "o", "X")).toEqual("HellX WXrld!");
    });
});