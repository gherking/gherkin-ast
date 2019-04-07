import {Element} from "../../src";
import * as common from "../../src/common";
import {Step} from "../../src/ast/step";

describe("Element", () => {
    test("should create a model of element", () => {
        // Given
        // When
        const e: Element = new Element("String1", "String2", "String3");
        // Then
        expect(e).toBeDefined();
        expect(e.keyword).toEqual("String1");
        expect(e.name).toEqual("String2");
        expect(e.description).toEqual("String3");
        expect(e.steps).toEqual([]);
    });

    test("should throw error when clone is called", () => {
        // Given
        const e1: Element = new Element("String1", "String2", "String3");
        // When
        // Then
        expect(() => e1.clone()).toThrow("Not implemented");
    });

    test("should have a method to replace content", () => {
        // Given
        const e: Element = new Element("String1", "String2", "String3");
        jest.spyOn(common, "replaceAll");
        // When
        e.replace("a", "b");
        // Then
        expect(common.replaceAll).toHaveBeenCalled();
    });

    test("should normalize step keywords", () => {
        // Given
        const e: Element = new Element("String1", "String2", "String3");
        e.steps.push(
            new Step("Given", "1"),
            new Step("When", "2"),
            new Step("And", "3"),
            new Step("Then", "4"),
            new Step("And", "5"));
        // When
        e.useNormalStepKeywords();
        // Then
        expect(e.steps.map(step => step.keyword)).toEqual(["Given","When","When","Then","Then"]);
    });

    test("should make keywords readable", () => {
        // Given
        const e: Element = new Element("String1", "String2", "String3");
        e.steps.push(
            new Step("Given", "1"),
            new Step("When", "2"),
            new Step("When", "3"),
            new Step("Then", "4"),
            new Step("Then", "5"));
        // When
        e.useReadableStepKeywords();
        // Then
        //TODO: Check if useNormalStepKeywords is called?
        expect(e.steps.map(step => step.keyword)).toEqual(["Given","When","And","Then","And"]);
    });
});
