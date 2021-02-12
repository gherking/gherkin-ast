import { Background, Rule, Scenario, ScenarioOutline } from "../../src";
import * as common from "../../src/common";
import { GherkinRule } from "../../src/gherkinObject";

describe("Rule", () => {
    test("should create a model of a Rule", () => {
        const rule = new Rule("Rule", "test", "description");
        expect(rule).toBeDefined();
        expect(rule.keyword).toEqual("Rule");
        expect(rule.name).toEqual("test");
        expect(rule.description).toEqual("description");
        expect(rule.elements).toEqual([]);
    });

    describe("clone", () => {
        const ruleA = new Rule("R", "T", "D");
        let ruleB: Rule;

        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(common, "cloneArray");
            ruleB = ruleA.clone();
        });

        test("should clone basic data of rule", () => {
            expect(ruleB).toBeDefined();
            expect(ruleB).toEqual(ruleA);
        });

        test("should clone elements", () => {
            expect(common.cloneArray).toHaveBeenCalledWith(ruleA.elements);
        });
    });

    describe("replace", () => {
        const ruleA: Rule = new Rule("R", "T", "D");
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(common, "replaceAll");
            jest.spyOn(common, "replaceArray");

            ruleA.replace("K", "V");
        });

        test("should replace in basic data", () => {
            expect(common.replaceAll).toHaveBeenCalledWith("T", "K", "V");
            expect(common.replaceAll).toHaveBeenCalledWith("D", "K", "V");
        });

        test("should replace in elements", () => {
            expect(common.replaceArray).toHaveBeenCalledWith(ruleA.elements, "K", "V");
        });
    });

    describe("parse", () => {
        test("should throw error of not GherkinRule passed", () => {
            const obj: GherkinRule = {} as GherkinRule;
            expect(() => Rule.parse(obj)).toThrowError(TypeError);
        });

        test("should parse GherkinRule", () => {
            const obj: GherkinRule = {
                rule: {
                    children: [],
                    description: "D",
                    keyword: "R",
                    name: "N",
                },
            } as GherkinRule;
            const rule: Rule = Rule.parse(obj);
            expect(rule).toBeDefined();
            expect(rule.keyword).toEqual("R");
            expect(rule.name).toEqual("N");
            expect(rule.description).toEqual("D");
            expect(rule.elements).toEqual([]);
        });

        test("should parse GherkinBackground children", () => {
            const obj: GherkinRule = {
                rule: {
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
                    keyword: "R",
                    name: "N",
                },
            } as GherkinRule;
            jest.spyOn(Background, "parse");
            const rule: Rule = Rule.parse(obj);
            expect(rule).toBeDefined();
            expect(rule.elements).toHaveLength(1);
            expect(Background.parse).toHaveBeenCalledTimes(1);
            expect(Background.parse).toHaveBeenCalledWith(obj.rule.children[0]);
        });

        test("should parse GherkinScenario children", () => {
            const obj: GherkinRule = {
                rule: {
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
                    keyword: "R",
                    name: "N",
                },
            } as GherkinRule;
            jest.spyOn(Scenario, "parse");
            const rule: Rule = Rule.parse(obj);
            expect(rule).toBeDefined();
            expect(rule.elements).toHaveLength(2);
            expect(Scenario.parse).toHaveBeenCalledTimes(2);
            expect(Scenario.parse).toHaveBeenCalledWith(obj.rule.children[0]);
            expect(Scenario.parse).toHaveBeenCalledWith(obj.rule.children[1]);
        });

        test("should parse GherkinScenario as Outline children", () => {
            const obj: GherkinRule = {
                rule: {
                    children: [
                        {
                            scenario: {
                                name: "N",
                                keyword: "B",
                                description: "D",
                                examples: [
                                    {
                                        keyword: "Examples",
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
                },
            } as GherkinRule;
            jest.spyOn(ScenarioOutline, "parse");
            jest.spyOn(Scenario, "parse");
            const rule: Rule = Rule.parse(obj);
            expect(rule).toBeDefined();
            expect(rule.elements).toHaveLength(2);
            expect(ScenarioOutline.parse).toHaveBeenCalledTimes(1);
            expect(ScenarioOutline.parse).toHaveBeenCalledWith(obj.rule.children[0]);
            expect(ScenarioOutline.parse).not.toHaveBeenCalledWith(obj.rule.children[1]);
        });
    });
});
