import { Element, Examples, Scenario, ScenarioOutline, Step, TableCell, TableRow, Tag, Comment, GherkinCommentHandler } from "../../src";
import * as common from "../../src/common";
import { GherkinExamples, GherkinScenario, GherkinStep, GherkinTag } from "../../src/gherkinObject";
import { pruneID } from "../../src/utils";

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
      expect(outline._id).toBeDefined();
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
      jest.spyOn(common, "replaceAll");
      outline.tags = [{ name: "T1" } as Tag];
      outline.tagComment = new Comment("# tag");
      outline.descriptionComment = new Comment("# description");
      outline.precedingComment = new Comment("# preceding");
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

    test("should replace in comments", () => {
      expect(common.replaceAll).toHaveBeenCalledWith("# tag", "e", "X");
      expect(common.replaceAll).toHaveBeenCalledWith("# description", "e", "X");
      expect(common.replaceAll).toHaveBeenCalledWith("# preceding", "e", "X");
    });
  });

  describe("clone", () => {
    let clonedOutline: ScenarioOutline;

    beforeEach(() => {
      jest.spyOn(common, "cloneArray");
      outline.tags = [new Tag("T1")];
      outline.steps = [new Step("K", "T")];
      outline.examples = [new Examples("K", "N")];
      outline.tagComment = new Comment("# tag");
      outline.descriptionComment = new Comment("# description");
      outline.precedingComment = new Comment("# preceding");
      clonedOutline = outline.clone();
    });

    test("should clone basic data", () => {
      expect(clonedOutline).toBeDefined();
      expect(clonedOutline._id).toBeDefined();
      expect(clonedOutline._id).not.toEqual(outline._id);
      expect(clonedOutline.keyword).toEqual("Keyword");
      expect(clonedOutline.name).toEqual("Name");
      expect(clonedOutline.description).toEqual("Description");
      expect(clonedOutline).not.toBe(outline);
    });

    test("should clone tags", () => {
      pruneID(clonedOutline);
      pruneID(outline);
      expect(common.cloneArray).toHaveBeenCalledWith(outline.tags);
      expect(clonedOutline.tags).toEqual(outline.tags);
      expect(clonedOutline.tags).not.toBe(outline.tags);
    });

    test("should clone steps", () => {
      pruneID(clonedOutline);
      pruneID(outline);
      expect(common.cloneArray).toHaveBeenCalledWith(outline.steps);
      expect(clonedOutline.steps).toEqual(outline.steps);
      expect(clonedOutline.steps).not.toBe(outline.steps);
    });

    test("should clone examples", () => {
      pruneID(clonedOutline);
      pruneID(outline);
      expect(common.cloneArray).toHaveBeenCalledWith(outline.examples);
      expect(clonedOutline.examples).toEqual(outline.examples);
      expect(clonedOutline.examples).not.toBe(outline.examples);
    });

    test("should clone comments", () => {
      expect(clonedOutline.tagComment.text).toEqual(outline.tagComment.text);
      expect(clonedOutline.tagComment).not.toBe(outline.tagComment);

      expect(clonedOutline.descriptionComment.text).toEqual(outline.descriptionComment.text);
      expect(clonedOutline.descriptionComment).not.toBe(outline.descriptionComment);

      expect(clonedOutline.precedingComment.text).toEqual(outline.precedingComment.text);
      expect(clonedOutline.precedingComment).not.toBe(outline.precedingComment);
    });
  });

  describe("parse", () => {
    let obj: GherkinScenario;

    beforeEach(() => {
      jest.spyOn(Step, "parseAll").mockReturnValue([new Step("K", "T")]);
      jest.spyOn(Tag, "parseAll").mockReturnValue([new Tag("N")]);
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
      jest.spyOn(Step, "parseAll").mockReturnValue([]);
      jest.spyOn(Tag, "parseAll").mockReturnValue([]);

      const parsed: ScenarioOutline = ScenarioOutline.parse(obj);
      expect(parsed).toBeDefined();
      expect(parsed.keyword).toEqual("Keyword");
      expect(parsed.name).toEqual("Name");
      expect(parsed.description).toEqual("Description");

      expect(Tag.parseAll).toHaveBeenCalledWith(undefined, undefined);
      expect(parsed.tags).toEqual([]);

      expect(Step.parseAll).toHaveBeenCalledWith(undefined, undefined);
      expect(parsed.steps).toEqual([]);

      expect(Examples.parse).not.toHaveBeenCalled();
      expect(parsed.examples).toEqual([]);
    });

    test("should parse steps", () => {
      obj.scenario.steps = [{ keyword: "K", text: "T" } as GherkinStep];
      const parsed: ScenarioOutline = ScenarioOutline.parse(obj);
      expect(parsed).toBeDefined();
      expect(Step.parseAll).toHaveBeenCalledWith(obj.scenario.steps, undefined);
      expect(pruneID(parsed.steps)).toEqual(pruneID([new Step("K", "T")]));
    });

    test("should parse tags", () => {
      obj.scenario.tags = [{ name: "N" } as GherkinTag];
      const parsed: ScenarioOutline = ScenarioOutline.parse(obj);
      expect(parsed).toBeDefined();
      expect(Tag.parseAll).toHaveBeenCalledWith(obj.scenario.tags, undefined);
      expect(pruneID(parsed.tags)).toEqual([pruneID(new Tag("N"))]);
    });

    test("should parse examples", () => {
      obj.scenario.examples = [{ keyword: "K", name: "E" } as GherkinExamples];
      const parsed: ScenarioOutline = ScenarioOutline.parse(obj);
      expect(parsed).toBeDefined();
      expect(Examples.parse).toHaveBeenCalledWith(obj.scenario.examples[0], undefined);
      expect(pruneID(parsed.examples)).toEqual([pruneID(new Examples("K", "N"))]);
    });

    test("should parse comments", () => {
      obj.scenario.steps = [{ keyword: "K", text: "T", location: { column: 1, line: 50 } }];
      obj.scenario.location = { column: 1, line: 42 };
      obj.scenario.tags = [
        { name: "N", location: { column: 1, line: 40 } },
      ];
      const comments = new GherkinCommentHandler([
        {
          location: { column: 1, line: 41 },
          text: "# preceding",
        },
        {
          location: { column: 1, line: 39 },
          text: "# tag",
        },
        {
          location: { column: 1, line: 45 },
          text: "# description",
        },
      ]);

      const parsed: ScenarioOutline = ScenarioOutline.parse(obj, comments);
      expect(pruneID(parsed)).toBeDefined();
      expect(parsed.tagComment.text).toEqual("# tag");
      expect(parsed.descriptionComment.text).toEqual("# description");
      expect(parsed.precedingComment.text).toEqual("# preceding");
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
      outline.tagComment = new Comment("# tag");
      outline.descriptionComment = new Comment("# description");
      outline.precedingComment = new Comment("# preceding");
      scenarios = outline.toScenario().map(pruneID) as Scenario[];
    });

    test("should parse as many scenario as examples rows", () => {
      expect(scenarios).toHaveLength(outline.examples[0].body.length);
    });

    test("should add column tag and examples tags", () => {
      expect(scenarios[0].tags).toEqual([
        pruneID(new Tag("T1")),
        pruneID(new Tag("T2")),
        pruneID(new Tag("T3")),
        pruneID(new Tag("A", "A1")),
      ]);
      expect(scenarios[1].tags).toEqual([
        pruneID(new Tag("T1")),
        pruneID(new Tag("T2")),
        pruneID(new Tag("T3")),
        pruneID(new Tag("A", "A2")),
      ]);
    });

    test("should clone steps", () => {
      expect(scenarios[0].steps).toEqual([
        pruneID(new Step("K", "X A1 Y")),
        pruneID(new Step("K", "X B1 Y")),
      ]);
      expect(scenarios[1].steps).toEqual([
        pruneID(new Step("K", "X A2 Y")),
        pruneID(new Step("K", "X B2 Y")),
      ]);
    });

    test("should replace header items with actual value", () => {
      expect(scenarios[0].name).toEqual("Name A1 B1");
      expect(scenarios[1].name).toEqual("Name A2 B2");
    });

    test("should clone comments", () => {
      expect(scenarios[0].tagComment.text).toEqual(outline.tagComment.text);
      expect(scenarios[1].tagComment.text).toEqual(outline.tagComment.text);

      expect(scenarios[0].descriptionComment.text).toEqual(outline.descriptionComment.text);
      expect(scenarios[1].descriptionComment.text).toEqual(outline.descriptionComment.text);

      expect(scenarios[0].precedingComment.text).toEqual(outline.precedingComment.text);
      expect(scenarios[1].precedingComment.text).toEqual(outline.precedingComment.text);
    });
  });
});
