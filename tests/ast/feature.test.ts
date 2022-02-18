import { Background, Feature, Rule, Scenario, ScenarioOutline, Tag } from "../../src";
import * as common from "../../src/common";
import { GherkinFeature, GherkinTag } from "../../src/gherkinObject";
import { pruneID } from "../../src/utils";

describe("Feature", () => {
    test("should create a model of a Feature", () => {
        // Given
        // When
        const feature = new Feature("Feature", "test", "description");
        // Then
        expect(feature).toBeDefined();
        expect(feature._id).toBeDefined();
        expect(feature.language).toEqual("en");
        expect(feature.keyword).toEqual("Feature");
        expect(feature.name).toEqual("test");
        expect(feature.description).toEqual("description");
        expect(feature.tags).toEqual([]);
        expect(feature.elements).toEqual([]);
    });

    describe("clone", () => {
        const featureA: Feature = new Feature("F", "T", "D");
        let featureB: Feature;

        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(common, "cloneArray");
            featureB = featureA.clone();
        });

        test("should clone basic data of feature", () => {
            expect(featureB).toBeDefined();
            expect(featureB._id).not.toEqual(featureA._id);
            expect(pruneID(featureB)).toEqual(pruneID(featureA));
        });

        test("should clone tags", () => {
            expect(common.cloneArray).toHaveBeenCalledWith(featureA.tags);
        });

        test("should clone elements", () => {
            expect(common.cloneArray).toHaveBeenCalledWith(featureA.elements);
        });
    });

    describe("replace", () => {
        const featureA: Feature = new Feature("F", "T", "D");
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(common, "replaceAll");
            jest.spyOn(common, "replaceArray");

            featureA.replace("K", "V");
        });

        test("should replace in basic data", () => {
            expect(common.replaceAll).toHaveBeenCalledWith("T", "K", "V");
            expect(common.replaceAll).toHaveBeenCalledWith("D", "K", "V");
        });

        test("should replace in tags", () => {
            expect(common.replaceArray).toHaveBeenCalledWith(featureA.tags, "K", "V");
        });

        test("should replace in elements", () => {
            expect(common.replaceArray).toHaveBeenCalledWith(featureA.elements, "K", "V");
        });
    });

    describe("parse", () => {
        test("should throw error of not GherkinFeature passed", () => {
            const obj: GherkinFeature = {} as GherkinFeature;
            expect(() => Feature.parse(obj)).toThrowError(TypeError);
        });

        test("should parse GherkinFeature", () => {
            const obj: GherkinFeature = {
                children: [],
                description: "D",
                keyword: "F",
                name: "N",
                language: "HU",
            } as GherkinFeature;
            const feature: Feature = Feature.parse(obj);
            expect(feature).toBeDefined();
            expect(feature._id).toBeDefined();
            expect(feature.keyword).toEqual("F");
            expect(feature.name).toEqual("N");
            expect(feature.language).toEqual("HU");
            expect(feature.description).toEqual("D");
            expect(feature.elements).toEqual([]);
            expect(feature.tags).toEqual([]);
        });

        test("should parse tags", () => {
            const obj: GherkinFeature = {
                children: [],
                description: "D",
                keyword: "F",
                name: "N",
                language: "HU",
                tags: [
                    { name: "TAG" } as GherkinTag,
                ],
            } as GherkinFeature;
            jest.spyOn(Tag, "parseAll");
            const feature: Feature = Feature.parse(obj);
            expect(feature).toBeDefined();
            expect(feature._id).toBeDefined();
            expect(feature.tags).toHaveLength(1);
            expect(Tag.parseAll).toHaveBeenCalledTimes(1);
            expect(Tag.parseAll).toHaveBeenCalledWith(obj.tags, undefined);
        });

        test("should parse GherkingRule children", () => {
            const obj: GherkinFeature = {
                children: [
                    {
                        rule: {
                            name: "N",
                            keyword: "R",
                            description: "D",
                            children: [],
                        },
                    },
                ],
                description: "D",
                keyword: "F",
                name: "N",
                language: "HU",
                tags: [],
            } as GherkinFeature;
            jest.spyOn(Rule, "parse");
            const feature: Feature = Feature.parse(obj);
            expect(feature).toBeDefined();
            expect(feature._id).toBeDefined();
            expect(feature.elements).toHaveLength(1);
            expect(Rule.parse).toHaveBeenCalledTimes(1);
            expect(Rule.parse).toHaveBeenCalledWith(obj.children[0], undefined);
        });

        test("should parse GherkinBackground children", () => {
            const obj: GherkinFeature = {
                children: [
                    {
                        background: {
                            name: "N",
                            keyword: "B",
                            description: "D",
                        },
                    },
                ],
                description: "D",
                keyword: "F",
                name: "N",
                language: "HU",
                tags: [],
            } as GherkinFeature;
            jest.spyOn(Background, "parse");
            const feature: Feature = Feature.parse(obj);
            expect(feature).toBeDefined();
            expect(feature.elements).toHaveLength(1);
            expect(Background.parse).toHaveBeenCalledTimes(1);
            expect(Background.parse).toHaveBeenCalledWith(obj.children[0], undefined);
        });

        test("should parse GherkinScenario children", () => {
            const obj: GherkinFeature = {
                children: [
                    {
                        scenario: {
                            name: "N",
                            keyword: "B",
                            description: "D",
                        },
                    },
                    {
                        scenario: {
                            name: "N",
                            keyword: "B",
                            description: "D",
                            examples: [],
                        },
                    },
                ],
                description: "D",
                keyword: "F",
                name: "N",
                language: "HU",
                tags: [],
            } as GherkinFeature;
            jest.spyOn(Scenario, "parse");
            const feature: Feature = Feature.parse(obj);
            expect(feature).toBeDefined();
            expect(feature.elements).toHaveLength(2);
            expect(Scenario.parse).toHaveBeenCalledTimes(2);
            expect(Scenario.parse).toHaveBeenCalledWith(obj.children[0], undefined);
            expect(Scenario.parse).toHaveBeenCalledWith(obj.children[1], undefined);
        });

        test("should parse GherkinScenario as Outline children", () => {
            const obj: GherkinFeature = {
                children: [
                    {
                        scenario: {
                            name: "N",
                            keyword: "B",
                            description: "D",
                            examples: [
                                {
                                    keyword: 'Examples',
                                    tableBody: [],
                                }
                            ],
                        },
                    },
                    {
                        scenario: {
                            name: "N",
                            keyword: "B",
                            description: "D",
                            examples: [],
                        },
                    },
                ],
                description: "D",
                keyword: "F",
                name: "N",
                language: "HU",
                tags: [],
            } as GherkinFeature;
            jest.spyOn(Scenario, "parse");
            jest.spyOn(ScenarioOutline, "parse");
            const feature: Feature = Feature.parse(obj);
            expect(feature).toBeDefined();
            expect(feature.elements).toHaveLength(2);
            expect(ScenarioOutline.parse).toHaveBeenCalledTimes(1);
            expect(ScenarioOutline.parse).toHaveBeenCalledWith(obj.children[0], undefined);
            expect(ScenarioOutline.parse).not.toHaveBeenCalledWith(obj.children[1], undefined);
        });
    });
});
