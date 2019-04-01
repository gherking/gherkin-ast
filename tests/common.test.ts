import { safeString, normalizeString, replaceAll, cloneArray, replaceArray } from "../src";

describe("safeString", () => {
    test("should remove white spaces", () => {
        expect(safeString(" Hello\tWorld     !!!")).toEqual("_Hello_World_____!!!");
    });

    test("should handle empty arguments", () => {
        expect(safeString()).toEqual("");
    });
});

describe("normalizeString", () => {
    test("should trim lines", () => {
        expect(normalizeString("  line1  \n  line2  \n    \n  line3")).toEqual("line1\nline2\n\nline3");
    });

    test("should handle empty arguments", () => {
        expect(normalizeString()).toEqual("");
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

describe("replaceArray", () => {
    class R {
        constructor(public mock: Function = jest.fn()) { }
        public replace(key: RegExp | string, value: string): void {
            this.mock(key, value);
        }
    }

    test("should replace in full array", () => {
        const elements: R[] = [new R(), new R(), new R()];
        replaceArray<R>(elements, "K", "V");
        for (const e of elements) {
            expect(e.mock).toHaveBeenCalledWith("K", "V");
        }
    });
})

describe("cloneArray", () => {
    class C {
        constructor(public mock: Function = jest.fn()) { }
        public clone(): C {
            this.mock();
            return this;
        }
    };

    test("should handle if not array passed", () => {
        expect(cloneArray<C>(null)).toEqual([]);
    });

    test("should clone full array", () => {
        const elements: C[] = [
            new C(), new C(), new C(),
        ];
        const cloned: C[] = cloneArray<C>(elements);
        for (const i in cloned) {
            expect(cloned[i]).toBe(elements[i]);
            expect(elements[i].mock).toHaveBeenCalled();
        }
    });
});