import { Comment } from "../../src";
import * as common from "../../src/common";
import { GherkinComment } from "../../src/gherkinObject";

describe("Comment", () => {
  test("should create model of a comment", () => {
    const c: Comment = new Comment("# comment");
    expect(c).toBeDefined();
    expect(c._id).toBeDefined();
    expect(c.text).toEqual("# comment");
  });

  test("shoudl have toString", () => {
    const c: Comment = new Comment("#comment");
    expect(c.toString()).toBe("#comment");
  });

  test("should have method to clone it", () => {
    const commentA: Comment = new Comment("A");
    const commentB: Comment = commentA.clone();

    expect(commentA.text).toEqual(commentB.text);
    expect(commentA).not.toBe(commentB);
    expect(commentB._id).not.toEqual(commentA._id);
  });

  test("should have method to replace value", () => {
    const c: Comment = new Comment("comment");
    jest.spyOn(common, "replaceAll");
    c.replace("a", "e");
    expect(common.replaceAll).toHaveBeenCalledWith("comment", "a", "e");
  });

  describe("parse", () => {
    test("should throw error if not GherkinComment passed", () => {
      expect(() => Comment.parse({} as GherkinComment)).toThrow();
    });

    test("should parse GherkinComment", () => {
      const c: Comment = Comment.parse({
        location: { column: 1, line: 1 },
        text: "#comment",
      });
      expect(c._id).toBeDefined();
      expect(c.text).toEqual("#comment");
    });

    test("should parse multiple GherkinComments", () => {
      const c: Comment = Comment.parse({
        location: { column: 1, line: 1 },
        text: "#comment",
      }, {
        location: { column: 1, line: 1 },
        text: "#comment2",
      });
      expect(c._id).toBeDefined();
      expect(c.text).toEqual("#comment\n#comment2");
    });
  });
});