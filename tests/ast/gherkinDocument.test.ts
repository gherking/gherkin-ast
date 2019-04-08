import {Document} from "../../src";
import {Feature} from "../../src/ast/feature";
import * as common from "../../src/common";
import {GherkinDocument, GherkinFeature} from "../../src/gherkinObject";

describe("Document", () => {

    test("should clone gherkinDocument without feature", () => {
        // Given
        const d: Document = new Document("String1");
        // When
        const clone: Document = d.clone();
        // Then
        expect(clone).toEqual(d);
        expect(clone.feature).toEqual(null);
    });

    test("should clone gherkinDocument with feature", () => {
        // Given
        const d: Document = new Document("String1", new Feature("Keyword", "Name", "description"));
        // When
        const clone: Document = d.clone();
        // Then
        expect(clone).toEqual(d);
        expect(clone.feature).toEqual(d.feature);
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
        jest.spyOn(Feature, "parse").mockReturnValue(new Feature("S1","S2","S3"));
        // When
        const d: Document = Document.parse({
            gherkinDocument: {
                uri: "string",
                feature: {} as GherkinFeature
            }
        });
        // Then
        expect(d.uri).toEqual("string");
        expect(Feature.parse).toHaveBeenCalledWith({});
        expect(d.feature).toEqual(new Feature("S1","S2","S3"));
    });
});
