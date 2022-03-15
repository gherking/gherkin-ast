import { Comment, Document, GherkinCommentHandler } from "../../src";
import { Feature } from "../../src/ast/feature";
import * as common from "../../src/common";
import { GherkinDocument, GherkinFeature } from "../../src/gherkinObject";
import { pruneID } from "../../src/utils";

describe("Document", () => {

  test("should create gherkinDocument", () => {
    // Given
    // When
    const d = new Document("features/test.feature");
    // Then
    expect(d).toBeDefined();
    expect(d.uri).toEqual("features/test.feature");
    expect(d.sourceFile).toEqual("test.feature");
    expect(d.sourceFolder).toEqual("features");
    expect(d.targetFile).toEqual("test.feature");
    expect(d.targetFolder).toEqual("features");
    expect(d.feature).toEqual(null);
  });

  test("should clone gherkinDocument without feature", () => {
    // Given
    const d: Document = new Document("String1");
    // When
    const clone: Document = d.clone();
    // Then
    expect(clone._id).not.toEqual(d._id);
    expect(pruneID(clone)).toEqual(pruneID(d));
    expect(clone.feature).toEqual(null);
  });

  test("should clone gherkinDocument with feature", () => {
    // Given
    const d: Document = new Document("String1", new Feature("Keyword", "Name", "description"));
    // When
    const clone: Document = d.clone();
    // Then
    expect(pruneID(clone)).toEqual(pruneID(d));
    expect(clone.feature).toEqual(d.feature);
    expect(clone.feature).not.toBe(d.feature);
  });

  test("should clone gherkinDocument with comments", () => {
    // Given
    const d: Document = new Document("String1", new Feature("Keyword", "Name", "description"));
    d.startComment = new Comment("# start");
    d.endComment = new Comment("# end");
    // When
    const clone: Document = d.clone();
    // Then
    expect(pruneID(clone)).toEqual(pruneID(d));
    expect(clone.feature).toEqual(d.feature);
    expect(clone.feature).not.toBe(d.feature);
    expect(clone.startComment).toEqual(d.startComment);
    expect(clone.startComment).not.toBe(d.startComment);
    expect(clone.endComment).toEqual(d.endComment);
    expect(clone.endComment).not.toBe(d.endComment);
  });

  test("should replace in the whole document", () => {
    const d: Document = new Document("String1", new Feature("Keyword", "Name", "description"));
    d.startComment = new Comment("# start");
    d.endComment = new Comment("# end");
    jest.spyOn(common, "replaceAll");
    jest.spyOn(common, "replaceArray");
    // When
    d.replace("a", "b");
    // Then
    expect(common.replaceAll).toHaveBeenCalledWith("Name", "a", "b");
    expect(common.replaceAll).toHaveBeenCalledWith("description", "a", "b");
    expect(common.replaceAll).toHaveBeenCalledWith("# start", "a", "b");
    expect(common.replaceAll).toHaveBeenCalledWith("# end", "a", "b");
    expect(common.replaceArray).toHaveBeenCalled();
  });

  test("should throw error when object is not document", () => {
    // Given
    // When
    // Then
    expect(() => Document.parse({} as GherkinDocument)).toThrow();
  });

  test("should parse GherkinDocument", () => {
    // Given
    jest.spyOn(Feature, "parse").mockImplementation((_, comments) => {
      comments.firstLine = 42;
      comments.lastLine = 42;
      return new Feature("S1", "S2", "S3");
    });
    // When
    const d: Document = Document.parse({
      gherkinDocument: {
        uri: "features/test.feature",
        feature: {} as GherkinFeature,
        comments: [
          {
            location: { column: 1, line: 32 },
            text: "# starting",
          },
          {
            location: { column: 1, line: 52 },
            text: "# ending",
          },
        ]
      },
    });
    // Then
    expect(d.uri).toEqual("features/test.feature");
    expect(Feature.parse).toHaveBeenCalledWith({}, expect.any(GherkinCommentHandler));
    expect(pruneID(d.feature)).toEqual(pruneID(new Feature("S1", "S2", "S3")));
    expect(d.startComment.text).toEqual("# starting");
    expect(d.endComment.text).toEqual("# ending");
  });
});
