import { Background, Comment, GherkinCommentHandler, Rule, Scenario, ScenarioOutline, Tag } from "../../src";
import * as common from "../../src/common";
import { GherkinRule, GherkinTag } from "../../src/gherkinObject";
import { pruneID } from "../../src/utils";

describe("Rule", () => {
  test("should create a model of a Rule", () => {
    const rule = new Rule("Rule", "test", "description");
    expect(rule).toBeDefined();
    expect(rule._id).toBeDefined();
    expect(rule.keyword).toEqual("Rule");
    expect(rule.name).toEqual("test");
    expect(rule.description).toEqual("description");
    expect(rule.tags).toEqual([]);
    expect(rule.elements).toEqual([]);
  });

  describe("clone", () => {
    const ruleA = new Rule("R", "T", "D");
    let ruleB: Rule;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(common, "cloneArray");

      ruleA.descriptionComment = new Comment("# description");
      ruleA.tagComment = new Comment("# tag");
      ruleA.preceedingComment = new Comment("# preceeding");

      ruleB = ruleA.clone();
    });

    test("should clone basic data of rule", () => {
      expect(ruleB).toBeDefined();
      expect(ruleB._id).not.toEqual(ruleA._id);
      expect(pruneID(ruleB)).toEqual(pruneID(ruleA));
    });

    test("should clone tags", () => {
      expect(common.cloneArray).toHaveBeenCalledWith(ruleA.tags);
    });

    test("should clone elements", () => {
      expect(common.cloneArray).toHaveBeenCalledWith(ruleA.elements);
      expect(ruleB.elements.length).toBe(ruleA.elements.length);
    });

    test("should clone comments", () => {
      expect(ruleB.descriptionComment.text).toEqual(ruleA.descriptionComment.text);
      expect(ruleB.descriptionComment).not.toBe(ruleA.descriptionComment);

      expect(ruleB.tagComment.text).toEqual(ruleA.tagComment.text);
      expect(ruleB.tagComment).not.toBe(ruleA.tagComment);

      expect(ruleB.preceedingComment.text).toEqual(ruleA.preceedingComment.text);
      expect(ruleB.preceedingComment).not.toBe(ruleA.preceedingComment);
    });
  });

  describe("replace", () => {
    const ruleA: Rule = new Rule("R", "T", "D");
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(common, "replaceAll");
      jest.spyOn(common, "replaceArray");

      ruleA.descriptionComment = new Comment("# description");
      ruleA.tagComment = new Comment("# tag");
      ruleA.preceedingComment = new Comment("# preceeding");

      ruleA.replace("K", "V");
    });

    test("should replace in basic data", () => {
      expect(common.replaceAll).toHaveBeenCalledWith("T", "K", "V");
      expect(common.replaceAll).toHaveBeenCalledWith("D", "K", "V");
    });

    test("should replace in tags", () => {
      expect(common.replaceArray).toHaveBeenCalledWith(ruleA.tags, "K", "V");
    });

    test("should replace in elements", () => {
      expect(common.replaceArray).toHaveBeenCalledWith(ruleA.elements, "K", "V");
    });

    test("should replace in comments", () => {
      expect(common.replaceAll).toHaveBeenCalledWith("# tag", "K", "V");
      expect(common.replaceAll).toHaveBeenCalledWith("# description", "K", "V");
      expect(common.replaceAll).toHaveBeenCalledWith("# preceeding", "K", "V");
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
      expect(rule._id).toBeDefined();
      expect(rule.keyword).toEqual("R");
      expect(rule.name).toEqual("N");
      expect(rule.description).toEqual("D");
      expect(rule.elements).toEqual([]);
      expect(rule.tags).toEqual([]);
    });

    test("should parse tags", () => {
      const obj: GherkinRule = {
        rule: {
          children: [],
          description: "D",
          keyword: "R",
          name: "N",
          tags: [
            { name: "TAG" } as GherkinTag,
          ],
        },
      } as GherkinRule;
      jest.spyOn(Tag, "parseAll");
      const rule: Rule = Rule.parse(obj);
      expect(rule).toBeDefined();
      expect(rule._id).toBeDefined();
      expect(rule.tags).toHaveLength(1);
      expect(Tag.parseAll).toHaveBeenCalledWith(obj.rule.tags, undefined);
    });

    test("should parse comments", () => {
      const obj: GherkinRule = {
        rule: {
          children: [
            {
              background: {
                location: { column: 1, line: 47 },
              }
            }
          ],
          description: "D",
          keyword: "R",
          name: "N",
          tags: [
            { name: "TAG", location: { column: 1, line: 40 } },
          ],
          location: { column: 1, line: 42 },
        },
      } as GherkinRule;
      const comments = new GherkinCommentHandler([
        {
          location: { column: 1, line: 41 },
          text: "# preceeding",
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

      jest.spyOn(Tag, "parseAll");

      const rule: Rule = Rule.parse(obj, comments);
      expect(rule).toBeDefined();

      expect(rule.tagComment).toBeDefined();
      expect(rule.tagComment.text).toEqual("# tag");

      expect(rule.descriptionComment).toBeDefined();
      expect(rule.descriptionComment.text).toEqual("# description");

      expect(rule.preceedingComment).toBeDefined();
      expect(rule.preceedingComment.text).toEqual("# preceeding");
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
          tags: [],
        },
      } as GherkinRule;
      jest.spyOn(Background, "parse");
      const rule: Rule = Rule.parse(obj);
      expect(rule).toBeDefined();
      expect(rule._id).toBeDefined();
      expect(rule.elements).toHaveLength(1);
      expect(Background.parse).toHaveBeenCalledTimes(1);
      expect(Background.parse).toHaveBeenCalledWith(obj.rule.children[0], undefined);
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
          tags: [],
        },
      } as GherkinRule;
      jest.spyOn(Scenario, "parse");
      const rule: Rule = Rule.parse(obj);
      expect(rule).toBeDefined();
      expect(rule._id).toBeDefined();
      expect(rule.elements).toHaveLength(2);
      expect(Scenario.parse).toHaveBeenCalledTimes(2);
      expect(Scenario.parse).toHaveBeenCalledWith(obj.rule.children[0], undefined);
      expect(Scenario.parse).toHaveBeenCalledWith(obj.rule.children[1], undefined);
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
          tags: [],
        },
      } as GherkinRule;
      jest.spyOn(ScenarioOutline, "parse");
      jest.spyOn(Scenario, "parse");
      const rule: Rule = Rule.parse(obj);
      expect(rule).toBeDefined();
      expect(rule._id).toBeDefined();
      expect(rule.elements).toHaveLength(2);
      expect(ScenarioOutline.parse).toHaveBeenCalledTimes(1);
      expect(ScenarioOutline.parse).toHaveBeenCalledWith(obj.rule.children[0], undefined);
      expect(ScenarioOutline.parse).not.toHaveBeenCalledWith(obj.rule.children[1], undefined);
    });
  });
});
