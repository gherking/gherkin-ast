import { removeDuplicateTags, Tag, tag } from "../../src";
import * as common from "../../src/common";
import { GherkinTag } from "../../src/gherkinObject";
import { pruneID } from "../../src/utils";

describe("Tag", () => {
    test("should create model of a tag", () => {
        const t: Tag = new Tag("name");
        expect(t).toBeDefined();
        expect(t._id).toBeDefined();
        expect(t.name).toEqual("name");
        expect(t.value).toBeFalsy();
    });

    test("should create model of a parametirized tag", () => {
        const t = new Tag("name", "value");
        expect(t).toBeDefined();
        expect(t._id).toBeDefined();
        expect(t.name).toEqual("name");
        expect(t.value).toEqual("value");
    })

    test("should have method to clone it", () => {
        const tagA: Tag = new Tag("A", "V");
        const tagB: Tag = tagA.clone();

        expect(tagA.name).toEqual(tagB.name);
        expect(tagA.value).toEqual(tagB.value);
        expect(tagA).not.toBe(tagB);
        expect(tagB._id).not.toEqual(tagA._id);
    });

    test("should have toString for simple tag", () => {
        const t: Tag = new Tag("tag");
        expect(t.toString()).toEqual("@tag");
    });

    test("should have toString for parametirized tag", () => {
        const t: Tag = new Tag("tag", "value");
        expect(t.toString()).toEqual("@tag(value)");
    });

    test("should have method to replace value", () => {
        const t: Tag = new Tag("tag", "value");
        jest.spyOn(common, "replaceAll");
        t.replace("a", "e");
        expect(common.replaceAll).toHaveBeenCalledWith("tag", "a", "e");
        expect(common.replaceAll).toHaveBeenCalledWith("value", "a", "e");
    });

    describe("parse", () => {
        test("should throw error if not GherkinTag passed", () => {
            expect(() => Tag.parse({} as GherkinTag)).toThrow();
        });

        test("should parse GherkinTag", () => {
            const t: Tag = Tag.parse({
                location: { column: 1, line: 1 },
                name: "tag(value)",
            });
            expect(t._id).toBeDefined();
            expect(t.name).toEqual("tag");
            expect(t.value).toEqual("value");
        });
    });

    describe("parseString", () => {
        test("should throw error if not Gherkin tag passed", () => {
            expect(() => Tag.parseString()).toThrow();
        });

        test("should parse Gherkin tag", () => {
            const t: Tag = Tag.parseString("@name(value)");
            expect(t._id).toBeDefined();
            expect(t.name).toEqual("name");
            expect(t.value).toEqual("value");
        });

        test("should parse Gherkin tag without at", () => {
            const t: Tag = Tag.parseString("name(value)");
            expect(t._id).toBeDefined();
            expect(t.name).toEqual("name");
            expect(t.value).toEqual("value");
        });
    });
});

describe("tag", () => {
    test("should create parameterized tag", () => {
        expect(tag("name", "value").toString()).toEqual("@name(value)");
    });

    test("should create simple tag", () => {
        expect(tag("name").toString()).toEqual("@name");
    });
});

describe("removeDuplicateTags", () => {
    test("should remove duplicate tags", () => {
        expect(pruneID(removeDuplicateTags([
            new Tag("A"),
            new Tag("B"),
            new Tag("A"),
            new Tag("C"),
        ]))).toEqual(pruneID([
            new Tag("A"),
            new Tag("B"),
            new Tag("C"),
        ]));
    });
});
