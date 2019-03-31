import { Tag, tag } from "../../src";
import { GherkinTag } from "../../src/gherkinObject";

describe("Tag", () => {
    test("should create model of a tag", () => {
        const tag: Tag = new Tag("name");
        expect(tag).toBeDefined();
        expect(tag.name).toEqual("name");
    });

    test("should have method to clone it", () => {
        const tagA: Tag = new Tag("A");
        const tagB: Tag = tagA.clone();

        expect(tagA).not.toStrictEqual(tagB);
        expect(tagA.name).toEqual(tagB.name);
    });

    test("should have toString", () => {
        const tag: Tag = new Tag("tag");
        expect(tag.toString()).toEqual("@tag");
    });

    test("should have method to replace value", () => {
        const tag: Tag = new Tag("tag");
        tag.replace("a", "e");
        expect(tag.name).toEqual("teg");
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