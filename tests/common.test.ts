import { cloneArray, normalizeString, replaceAll, replaceArray, safeString, GherkinCommentHandler, GherkinComment } from "../src";

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
        constructor(public mock: (key: RegExp | string, value: string) => void = jest.fn()) { }

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
});

describe("cloneArray", () => {
    class C {
        constructor(public mock: () => void = jest.fn()) { }

        public clone(): C {
            this.mock();
            return this;
        }
    }

    test("should handle if not array passed", () => {
        expect(cloneArray<C>(null)).toEqual([]);
    });

    test("should clone full array", () => {
        const elements: C[] = [
            new C(), new C(), new C(),
        ];
        const cloned: C[] = cloneArray<C>(elements);
        cloned.forEach((c: C, i: number): void => {
            expect(c).toBe(elements[i]);
            expect(elements[i].mock).toHaveBeenCalled();
        });
    });
});

describe.only("GherkinCommentHandler", () => {
    let comments: GherkinComment[];
    let handler: GherkinCommentHandler;

    const commentToLine = (line: number): GherkinComment => ({
        location: { column: 1, line },
        text: 'comment in line ' + line,
    });

    beforeEach(() => {
        comments = [11, 12, 14, 15, 17, 19, 20].map(commentToLine);
        handler = new GherkinCommentHandler(comments);
    });

    describe("popFromIndex", () => {
        test("should remove comment by index", () => {
            const c = handler.popFromIndex(1);
            expect(c.location.line).toBe(12);

            expect(handler.comments).toHaveLength(comments.length - 1);
            expect(handler.comments[0].location.line).toBe(comments[0].location.line);
            expect(handler.comments[1].location.line).toBe(comments[2].location.line);
        });

        test("should handle removing comment with incorrect index", () => {
            const c = handler.popFromIndex(500);
            expect(c).toBeUndefined();

            expect(handler.comments).toHaveLength(comments.length);
        });
    });

    describe("popCommentsRightBefore", () => {
        test("should not remove subsequent comments", () => {
            const c = handler.popCommentsRightBefore({ column: 1, line: 200 });
            expect(c).toEqual([]);

            expect(handler.comments).toHaveLength(comments.length);
        });

        test("should remove single comment until space", () => {
            const c = handler.popCommentsRightBefore({ column: 1, line: 18 });
            expect(c).toHaveLength(1);
            expect(c[0].location.line).toBe(17);

            expect(handler.comments).toHaveLength(comments.length - 1);
        });

        test("should remove multiple comments", () => {
            const c = handler.popCommentsRightBefore({ column: 1, line: 16 });
            expect(c).toHaveLength(2);
            expect(c[0].location.line).toBe(14);
            expect(c[1].location.line).toBe(15);

            expect(handler.comments).toHaveLength(comments.length - 2);
        });
    });
});
