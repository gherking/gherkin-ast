import { Document } from "../../src";
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

  test("should replace feature of document", () => {
    const d: Document = new Document("String1", new Feature("Keyword", "Name", "description"));
    jest.spyOn(common, "replaceAll");
    jest.spyOn(common, "replaceArray");
    // When
    d.replace("a", "b");
    // Then
    expect(common.replaceAll).toHaveBeenCalled();
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
    jest.spyOn(Feature, "parse").mockReturnValue(new Feature("S1", "S2", "S3"));
    // When
    const d: Document = Document.parse({
      gherkinDocument: {
        uri: "features/test.feature",
        feature: {} as GherkinFeature,
      },
    });
    // Then
    expect(d.uri).toEqual("features/test.feature");
    expect(Feature.parse).toHaveBeenCalledWith({}, { comments: [], firstLine: Infinity, lastLine: 0 });
    expect(pruneID(d.feature)).toEqual(pruneID(new Feature("S1", "S2", "S3")));
  });
});
