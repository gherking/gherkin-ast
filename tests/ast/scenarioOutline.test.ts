import { Element, Examples, Scenario, ScenarioOutline, Step, TableCell, TableRow, Tag } from "../../src";
import * as common from "../../src/common";
import { GherkinExamples, GherkinScenario, GherkinStep, GherkinTag } from "../../src/gherkinObject";

describe("ScenarioOutline", () => {
    let outline: ScenarioOutline;

    beforeEach(() => {
        jest.restoreAllMocks();
        outline = new ScenarioOutline(
            "Keyword", "Name", "Description",
        );
    });

    describe("constructor", () => {
        test("should create model of a Scenario Outline", () => {
            expect(outline).toBeDefined();
            expect(outline.keyword).toEqual("Keyword");
            expect(outline.name).toEqual("Name");
            expect(outline.description).toEqual("Description");
        });

        test("should extend Element", () => {
            expect(outline).toBeInstanceOf(Element);
        });

        test("should initialize tags", () => {
            expect(outline.tags).toEqual([]);
        });

        test("should initialize examples", () => {
            expect(outline.examples).toEqual([]);
        });
    });

    describe("replace", () => {
        beforeEach(() => {
            jest.spyOn(common, "replaceArray").mockReturnValue();
            outline.tags = [{ name: "T1" } as Tag];
            outline.replace("e", "X");
        });

        test("should replace based data", () => {
            expect(outline.name).toEqual("NamX");
            expect(outline.description).toEqual("DXscription");
        });

        test("should replace in tags", () => {
            expect(common.replaceArray).toHaveBeenCalledWith([{ name: "T1" }], "e", "X");
        });

        test("should replace in examples", () => {
            expect(common.replaceArray).toHaveBeenCalledWith([], "e", "X");
        });
    });

    describe("clone", () => {
        let clonedOutline: ScenarioOutline;

        beforeEach(() => {
            jest.spyOn(common, "cloneArray");
            outline.tags = [new Tag("T1")];
            outline.steps = [new Step("K", "T")];
            outline.examples = [new Examples("K", "N")];
            clonedOutline = outline.clone();
        });

        test("should clone basic data", () => {
            expect(clonedOutline).toBeDefined();
            expect(clonedOutline.keyword).toEqual("Keyword");
            expect(clonedOutline.name).toEqual("Name");
            expect(clonedOutline.description).toEqual("Description");
            expect(clonedOutline).not.toBe(outline);
        });

        test("should clone tags", () => {
            expect(common.cloneArray).toHaveBeenCalledWith(outline.tags);
            expect(clonedOutline.tags).toEqual(outline.tags);
            expect(clonedOutline.tags).not.toBe(outline.tags);
        });

        test("should clone steps", () => {
            expect(common.cloneArray).toHaveBeenCalledWith(outline.steps);
            expect(clonedOutline.steps).toEqual(outline.steps);
            expect(clonedOutline.steps).not.toBe(outline.steps);
        });

        test("should clone examples", () => {
            expect(common.cloneArray).toHaveBeenCalledWith(outline.examples);
            expect(clonedOutline.examples).toEqual(outline.examples);
            expect(clonedOutline.examples).not.toBe(outline.examples);
        });
    });

    describe("parse", () => {
        let obj: GherkinScenario;

        beforeEach(() => {
            jest.spyOn(Step, "parse").mockReturnValue(new Step("K", "T"));
            jest.spyOn(Tag, "parse").mockReturnValue(new Tag("N"));
            jest.spyOn(Examples, "parse").mockReturnValue(new Examples("K", "N"));
            obj = {
                scenario: {
                    keyword: "Keyword",
                    name: "Name",
                    description: "Description",
                    examples: [],
                },
            } as GherkinScenario;
        });

        test("should throw error if not GherkinScenario as Outline passed", () => {
            expect(() => ScenarioOutline.parse({ scenario: {} } as GherkinScenario)).toThrow();
        });

        test("should parse basic data", () => {
            const parsed: ScenarioOutline = ScenarioOutline.parse(obj);
            expect(parsed).toBeDefined();
            expect(parsed.keyword).toEqual("Keyword");
            expect(parsed.name).toEqual("Name");
            expect(parsed.description).toEqual("Description");

            expect(Tag.parse).not.toHaveBeenCalled();
            expect(parsed.tags).toEqual([]);

            expect(Step.parse).not.toHaveBeenCalled();
            expect(parsed.steps).toEqual([]);

            expect(Examples.parse).not.toHaveBeenCalled();
            expect(parsed.examples).toEqual([]);
        });

        test("should parse steps", () => {
            obj.scenario.steps = [{ keyword: "K", text: "T" } as GherkinStep];
            const parsed: ScenarioOutline = ScenarioOutline.parse(obj);
            expect(parsed).toBeDefined();
            expect(Step.parse).toHaveBeenCalledWith(obj.scenario.steps[0], 0, obj.scenario.steps);
            expect(parsed.steps).toEqual([new Step("K", "T")]);
        });

        test("should parse tags", () => {
            obj.scenario.tags = [{ name: "N" } as GherkinTag];
            const parsed: ScenarioOutline = ScenarioOutline.parse(obj);
            expect(parsed).toBeDefined();
            expect(Tag.parse).toHaveBeenCalledWith(obj.scenario.tags[0], 0, obj.scenario.tags);
            expect(parsed.tags).toEqual([new Tag("N")]);
        });

        test("should parse examples", () => {
            obj.scenario.examples = [{ keyword: "K", name: "E" } as GherkinExamples];
            const parsed: ScenarioOutline = ScenarioOutline.parse(obj);
            expect(parsed).toBeDefined();
            expect(Examples.parse).toHaveBeenCalledWith(obj.scenario.examples[0], 0, obj.scenario.examples);
            expect(parsed.examples).toEqual([new Examples("K", "N")]);
        });
    });

    describe("toScenario", () => {
        let scenarios: Scenario[];

        beforeEach(() => {
            outline.name = "Name <A> <B>";
            outline.steps = [
                new Step("K", "X <A> Y"),
                new Step("K", "X <B> Y"),
            ];
            outline.tags = [
                new Tag("T1"),
                new Tag("T2"),
            ];
            outline.examples = [new Examples("K", "E")];
            outline.examples[0].tags = [
                new Tag("T1"),
                new Tag("T3"),
            ];
            outline.examples[0].header = new TableRow([
                new TableCell("A"),
                new TableCell("B"),
            ]);
            outline.examples[0].body = [
                new TableRow([
                    new TableCell("A1"),
                    new TableCell("B1"),
                ]),
                new TableRow([
                    new TableCell("A2"),
                    new TableCell("B2"),
                ]),
            ];
            scenarios = outline.toScenario();
        });

        test("should parse as many scenario as examples rows", () => {
            expect(scenarios).toHaveLength(outline.examples[0].body.length);
        });

        test("should add column tag and examples tags", () => {
            expect(scenarios[0].tags).toEqual([
                new Tag("T1"),
                new Tag("T2"),
                new Tag("T3"),
                new Tag("A", "A1"),
            ]);
            expect(scenarios[1].tags).toEqual([
                new Tag("T1"),
                new Tag("T2"),
                new Tag("T3"),
                new Tag("A", "A2"),
            ]);
        });

        test("should clone steps", () => {
            expect(scenarios[0].steps).toEqual([
                new Step("K", "X A1 Y"),
                new Step("K", "X B1 Y"),
            ]);
            expect(scenarios[1].steps).toEqual([
                new Step("K", "X A2 Y"),
                new Step("K", "X B2 Y"),
            ]);
        });

        test("should replace header items with actual value", () => {
            expect(scenarios[0].name).toEqual("Name A1 B1");
            expect(scenarios[1].name).toEqual("Name A2 B2");
        });
    });
});
