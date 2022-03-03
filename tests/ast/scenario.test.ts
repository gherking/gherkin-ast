import { Comment, Element, GherkinCommentHandler, Scenario, Step, Tag } from "../../src";
import * as common from "../../src/common";
import { GherkinScenario, GherkinStep, GherkinTag } from "../../src/gherkinObject";
import { pruneID } from "../../src/utils";

describe("Scenario", () => {
  let scenario: Scenario;

  beforeEach(() => {
    jest.restoreAllMocks();
    scenario = new Scenario(
      "Keyword", "Name", "Description",
    );
  });

  describe("constructor", () => {
    test("should create model of a Scenario", () => {
      expect(scenario).toBeDefined();
      expect(scenario.keyword).toEqual("Keyword");
      expect(scenario.name).toEqual("Name");
      expect(scenario.description).toEqual("Description");
    });

    test("should extend Element", () => {
      expect(scenario).toBeInstanceOf(Element);
    });

    test("should initialize tags", () => {
      expect(scenario.tags).toEqual([]);
    });
  });

  describe("replace", () => {
    beforeEach(() => {
      jest.spyOn(common, "replaceArray").mockReturnValue();
      jest.spyOn(common, "replaceAll");
      scenario.tags = [{ name: "T1" } as Tag];
      scenario.tagComment = new Comment("# tag");
      scenario.descriptionComment = new Comment("# description");
      scenario.precedingComment = new Comment("# preceding");
      scenario.replace("e", "X");
    });

    test("should replace based data", () => {
      expect(scenario.name).toEqual("NamX");
      expect(scenario.description).toEqual("DXscription");
    });

    test("should replace in tags", () => {
      expect(common.replaceArray).toHaveBeenCalledWith([{ name: "T1" }], "e", "X");
    });

    test("should replace in comments", () => {
      expect(common.replaceAll).toHaveBeenCalledWith("# tag", "e", "X");
      expect(common.replaceAll).toHaveBeenCalledWith("# description", "e", "X");
      expect(common.replaceAll).toHaveBeenCalledWith("# preceding", "e", "X");
    });
  });

  describe("clone", () => {
    let clonedScenario: Scenario;

    beforeEach(() => {
      jest.spyOn(common, "cloneArray");
      scenario.tags = [new Tag("T1")];
      scenario.steps = [new Step("K", "T")];
      scenario.tagComment = new Comment("# tag");
      scenario.descriptionComment = new Comment("# description");
      scenario.precedingComment = new Comment("# preceding");
      clonedScenario = scenario.clone();
      pruneID(scenario);
      pruneID(clonedScenario);
    });

    test("should clone basic data", () => {
      expect(clonedScenario).toBeDefined();
      expect(clonedScenario.keyword).toEqual("Keyword");
      expect(clonedScenario.name).toEqual("Name");
      expect(clonedScenario.description).toEqual("Description");
      expect(clonedScenario).not.toBe(scenario);
    });

    test("should clone tags", () => {
      expect(common.cloneArray).toHaveBeenCalledWith(scenario.tags);
      expect(clonedScenario.tags).toEqual(scenario.tags);
      expect(clonedScenario.tags).not.toBe(scenario.tags);
    });

    test("should clone steps", () => {
      expect(common.cloneArray).toHaveBeenCalledWith(scenario.steps);
      expect(clonedScenario.steps).toEqual(scenario.steps);
      expect(clonedScenario.steps).not.toBe(scenario.steps);
    });

    test("should clone comments", () => {
      expect(clonedScenario.tagComment.text).toEqual(scenario.tagComment.text);
      expect(clonedScenario.tagComment).not.toBe(scenario.tagComment);

      expect(clonedScenario.descriptionComment.text).toEqual(scenario.descriptionComment.text);
      expect(clonedScenario.descriptionComment).not.toBe(scenario.descriptionComment);

      expect(clonedScenario.precedingComment.text).toEqual(scenario.precedingComment.text);
      expect(clonedScenario.precedingComment).not.toBe(scenario.precedingComment);
    });
  });

  describe("parse", () => {
    let obj: GherkinScenario;

    beforeEach(() => {
      jest.spyOn(Step, "parseAll").mockReturnValue([new Step("K", "T")]);
      jest.spyOn(Tag, "parseAll").mockReturnValue([new Tag("N")]);
      obj = {
        scenario: {
          keyword: "Keyword",
          name: "Name",
          description: "Description",
        },
      } as GherkinScenario;
    });

    test("should throw error if not GherkinScenario as scenario passed", () => {
      expect(() => Scenario.parse({ scenario: { examples: [{}] } } as GherkinScenario)).toThrow();
    });

    test("should parse basic data", () => {
      jest.spyOn(Step, "parseAll").mockReturnValue([]);
      jest.spyOn(Tag, "parseAll").mockReturnValue([]);

      const parsed: Scenario = Scenario.parse(obj);
      expect(parsed).toBeDefined();
      expect(parsed._id).toBeDefined();
      expect(parsed.keyword).toEqual("Keyword");
      expect(parsed.name).toEqual("Name");
      expect(parsed.description).toEqual("Description");

      expect(Tag.parseAll).toHaveBeenCalledWith(undefined, undefined);
      expect(parsed.tags).toEqual([]);

      expect(Step.parseAll).toHaveBeenCalledWith(undefined, undefined);
      expect(parsed.steps).toEqual([]);
    });

    test("should parse steps", () => {
      obj.scenario.steps = [{ keyword: "K", text: "T" } as GherkinStep];
      const parsed: Scenario = Scenario.parse(obj);
      expect(pruneID(parsed)).toBeDefined();
      expect(Step.parseAll).toHaveBeenCalledWith(obj.scenario.steps, undefined);
      expect(parsed.steps).toEqual([pruneID(new Step("K", "T"))]);
    });

    test("should parse tags", () => {
      obj.scenario.tags = [{ name: "N" } as GherkinTag];
      const parsed: Scenario = Scenario.parse(obj);
      expect(pruneID(parsed)).toBeDefined();
      expect(Tag.parseAll).toHaveBeenCalledWith(obj.scenario.tags, undefined);
      expect(parsed.tags).toEqual([pruneID(new Tag("N"))]);
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

      const parsed: Scenario = Scenario.parse(obj, comments);
      expect(pruneID(parsed)).toBeDefined();
      expect(parsed.tagComment.text).toEqual("# tag");
      expect(parsed.descriptionComment.text).toEqual("# description");
      expect(parsed.precedingComment.text).toEqual("# preceding");
    });
  });
});
