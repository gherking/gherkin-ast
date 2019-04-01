import { Tag, tag, removeDuplicateTags } from "../../src";
import { GherkinTag } from "../../src/gherkinObject";
import * as common from "../../src/common";

describe("Tag", () => {
    test("should create model of a tag", () => {
        const tag: Tag = new Tag("name");
        expect(tag).toBeDefined();
        expect(tag.name).toEqual("name");
    });

    test("should have method to clone it", () => {
        const tagA: Tag = new Tag("A");
        const tagB: Tag = tagA.clone();

        expect(tagA.name).toEqual(tagB.name);
        expect(tagA).not.toBe(tagB);
    });

    test("should have toString", () => {
        const tag: Tag = new Tag("tag");
        expect(tag.toString()).toEqual("@tag");
    });

    test("should have method to replace value", () => {
        const tag: Tag = new Tag("tag");
        jest.spyOn(common, "replaceAll");
        tag.replace("a", "e");
        expect(common.replaceAll).toHaveBeenCalledWith("tag", "a", "e");
    });

    describe("parse", () => {
        test("should throw error if not GherkinTag passed", () => {
            expect(() => Tag.parse({} as GherkinTag)).toThrow();
        });

        test("should parse GherkinTag", () => {
            const tag: Tag = Tag.parse({
                location: { column: 1, line: 1 },
                name: "tag",
            });
            expect(tag.name).toEqual("tag");
        });
    });
});

describe("tag", () => {
    test("should create parameterized tag", () => {
        expect(tag("name", "value").name).toEqual("name(value)");
    });

    test("should create simple tag", () => {
        expect(tag("name").name).toEqual("name");
    });
});

describe("removeDuplicateTags", () => {
    test("should remove duplicate tags", () => {
        expect(removeDuplicateTags([
            new Tag("A"),
            new Tag("B"),
            new Tag("A"),
            new Tag("C"),
        ])).toEqual([
            new Tag("A"),
            new Tag("B"),
            new Tag("C"),
        ]);
    });
});