import { Comment, DocString } from "../../src";
import * as common from "../../src/common";
import { GherkinDocString } from "../../src/gherkinObject";

describe("DocString", () => {
  test("should create a model of docString", () => {
    // Given
    // When
    const s: DocString = new DocString("String", "\"\"\"", "markdown");
    // Then
    expect(s).toBeDefined();
    expect(s._id).toBeDefined();
    expect(s.content).toEqual("String");
    expect(s.delimiter).toEqual("\"\"\"");
    expect(s.mediaType).toEqual("markdown");
  });

  test("should have a method to clone docString", () => {
    // Given
    const stringA: DocString = new DocString("A", "\"\"\"", "markdown");
    stringA.comment = new Comment("# comment");
    // When
    const stringB: DocString = stringA.clone();
    // Then
    expect(stringB._id).toBeDefined();
    expect(stringB._id).not.toEqual(stringA._id);
    expect(stringB.content).toEqual(stringA.content);
    expect(stringB.delimiter).toEqual(stringA.delimiter);
    expect(stringB.mediaType).toEqual(stringA.mediaType);
    expect(stringB).not.toBe(stringA);

    expect(stringB.comment.text).toEqual(stringA.comment.text);
    expect(stringB.comment).not.toBe(stringA.comment);
  });

  test("should have a method to replace content", () => {
    // Given
    const s: DocString = new DocString("String");
    s.comment = new Comment("# comment");
    jest.spyOn(common, "replaceAll");
    // When
    s.replace("a", "b");
    // Then
    expect(common.replaceAll).toHaveBeenCalledWith("String", "a", "b");
    expect(common.replaceAll).toHaveBeenCalledWith("# comment", "a", "b");
  });

  describe("parse", () => {
    test("should throw error if not docString is passed", () => {
      // Given
      const obj: GherkinDocString = {} as GherkinDocString;
      // When
      // Then
      expect(() => DocString.parse(obj)).toThrow();
    });

    test("should parse docString", () => {
      // Given
      const obj: GherkinDocString = {
        content: "String",
      } as GherkinDocString;
      // When
      const s: DocString = DocString.parse(obj);
      // Then
      expect(s).toBeDefined();
      expect(s._id).toBeDefined();
      expect(s.content).toEqual("String");
    });
  });
});
