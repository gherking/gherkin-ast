import {DocString} from "../../src"
import * as common from "../../src/common";
import {GherkinDocString} from "../../src/gherkinObject";

describe("DocString", () => {
    test("should create a model of docString", () => {
        // Given
        // When
        const string: DocString = new DocString("String", "\"\"\"");
        // Then
        expect(string).toBeDefined();
        expect(string.content).toEqual("String");
        expect(string.delimiter).toEqual( "\"\"\"");
    });

    test("should have a method to clone docString", () => {
        // Given
        const stringA: DocString = new DocString("A", "\"\"\"");
        // When
        const stringB: DocString = stringA.clone();
        // Then
        expect(stringB.content).toEqual(stringA.content);
        expect(stringB.delimiter).toEqual(stringA.delimiter);
        expect(stringB).not.toBe(stringA);
    });

    test("should have a method to replace content", () => {
        // Given
        const string: DocString = new DocString("String");
        jest.spyOn(common, "replaceAll");
        // When
        string.replace("a", "b");
        // Then
        expect(common.replaceAll).toHaveBeenCalled();
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
            const string: DocString = DocString.parse(obj);
            // Then
            expect(string).toBeDefined();
            expect(string.content).toEqual("String");
        });
    })

});