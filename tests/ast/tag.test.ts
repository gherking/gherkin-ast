import { Comment, removeDuplicateTags, Tag, tag } from "../../src";
import * as common from "../../src/common";
import { GherkinTag } from "../../src/gherkinObject";
import { pruneID } from "../../src/utils";
import config, {TagFormat} from "../../src/parseConfig";

describe("Tag", () => {
  beforeEach(() => {
    config.set();
  });

  test("should create model of a tag", () => {
    const t: Tag = new Tag("name");
    expect(t).toBeDefined();
    expect(t._id).toBeDefined();
    expect(t.name).toEqual("name");
    expect(t.value).toBeFalsy();
  });

  test("should create model of a parametrized tag", () => {
    const t = new Tag("name", "value");
    expect(t).toBeDefined();
    expect(t._id).toBeDefined();
    expect(t.name).toEqual("name");
    expect(t.value).toEqual("value");
  })

  test("should have method to clone it", () => {
    const tagA: Tag = new Tag("A", "V");
    tagA.comment = new Comment("# comment");
    const tagB: Tag = tagA.clone();

    expect(tagA.name).toEqual(tagB.name);
    expect(tagA.value).toEqual(tagB.value);
    expect(tagA).not.toBe(tagB);
    expect(tagB._id).not.toEqual(tagA._id);
    expect(tagB.comment.text).toEqual(tagA.comment.text);
    expect(tagB.comment).not.toBe(tagA.comment);
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
    t.comment = new Comment("# comment");
    jest.spyOn(common, "replaceAll");
    t.replace("a", "e");
    expect(common.replaceAll).toHaveBeenCalledWith("tag", "a", "e");
    expect(common.replaceAll).toHaveBeenCalledWith("value", "a", "e");
    expect(common.replaceAll).toHaveBeenCalledWith("# comment", "a", "e");
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

  describe("parseAll", () => {
    test("should handle empty tags", () => {
      expect(Tag.parseAll([])).toEqual([]);
    });

    test("should parse GherkinTags", () => {
      const t: Tag[] = Tag.parseAll([{
        location: { column: 1, line: 1 },
        name: "tag(value)",
      }]);
      expect(t[0]._id).toBeDefined();
      expect(t[0].name).toEqual("tag");
      expect(t[0].value).toEqual("value");
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

  describe("formats", () => {
    test("should support functional format", () => {
      config.set({
        tagFormat: TagFormat.FUNCTIONAL,
      });
      const t: Tag = Tag.parseString("@name(value)");
      expect(t._id).toBeDefined();
      expect(t.name).toEqual("name");
      expect(t.value).toEqual("value");
      expect(t.toString()).toEqual("@name(value)");
    });

    test("should support assignment format", () => {
      config.set({
        tagFormat: TagFormat.ASSIGNMENT,
      });
      const t: Tag = Tag.parseString("@name=value");
      expect(t._id).toBeDefined();
      expect(t.name).toEqual("name");
      expect(t.value).toEqual("value");
      expect(t.toString()).toEqual("@name=value");
    });

    test("should support underscore format", () => {
      config.set({
        tagFormat: TagFormat.UNDERSCORE,
      });
      const t: Tag = Tag.parseString("@name_value");
      expect(t._id).toBeDefined();
      expect(t.name).toEqual("name");
      expect(t.value).toEqual("value");
      expect(t.toString()).toEqual("@name_value");
    });

    test("should support parameterless format if set", () => {
      config.set({
        tagFormat: TagFormat.PARAMETERLESS,
      });
      const t: Tag = Tag.parseString("@name(value)");
      expect(t._id).toBeDefined();
      expect(t.name).toEqual("name(value)");
      expect(t.value).toEqual(undefined);
    });

    test("should support parameterless format as fallback from functional format", () => {
      config.set({
        tagFormat: TagFormat.FUNCTIONAL,
      });
      const t: Tag = Tag.parseString("@name");
      expect(t._id).toBeDefined();
      expect(t.name).toEqual("name");
      expect(t.value).toEqual(undefined);
      expect(t.toString()).toEqual("@name");
    });

    test("should support parameterless format as fallback from assignment format", () => {
      config.set({
        tagFormat: TagFormat.ASSIGNMENT,
      });
      const t: Tag = Tag.parseString("@name");
      expect(t._id).toBeDefined();
      expect(t.name).toEqual("name");
      expect(t.value).toEqual(undefined);
      expect(t.toString()).toEqual("@name");
    });

    test("should support parameterless format as fallback from underscore format", () => {
      config.set({
        tagFormat: TagFormat.UNDERSCORE,
      });
      const t: Tag = Tag.parseString("@name");
      expect(t._id).toBeDefined();
      expect(t.name).toEqual("name");
      expect(t.value).toEqual(undefined);
      expect(t.toString()).toEqual("@name");
    });

    test("should handle incorrect format", () => {
      config.set({
        // @ts-ignore
        tagFormat: "INCORRECT"
      });
      expect(() => Tag.parseString("@name")).toThrow();
      expect(() => new Tag("name").toString()).toThrow();
    });
  });
});

describe("tag", () => {
  beforeEach(() => {
    config.set();
  });

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
