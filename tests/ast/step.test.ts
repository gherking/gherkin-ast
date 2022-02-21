import { Comment, DataTable, DocString, GherkinCommentHandler, Step } from "../../src";
import * as common from "../../src/common";
import { GherkinDataTable, GherkinDocString, GherkinStep } from "../../src/gherkinObject";

describe("Step", () => {
  let step: Step;

  beforeEach(() => {
    jest.restoreAllMocks();
    step = new Step("When", "DO");
  });

  describe("constructor", () => {
    test("should creste model of a Step", () => {
      expect(step).toBeDefined();
      expect(step.keyword).toEqual("When");
      expect(step.text).toEqual("DO");
    });

    test("should initialize empty arguments", () => {
      expect(step.dataTable).toBeNull();
      expect(step.docString).toBeNull();
    });
  });

  describe("clone", () => {
    test("should clone step without arguments", () => {
      const cloned: Step = step.clone();
      expect(cloned.keyword).toEqual(step.keyword);
      expect(cloned.text).toEqual(step.text);
      expect(cloned.dataTable).toBeNull();
      expect(cloned.docString).toBeNull();
    });

    test("should clone step with data table", () => {
      step.dataTable = new DataTable([]);
      jest.spyOn(step.dataTable, "clone");

      const cloned: Step = step.clone();
      expect(cloned.dataTable).not.toBeNull();
      expect(step.dataTable.clone).toHaveBeenCalled();
    });

    test("should clone step with doc string", () => {
      step.docString = new DocString("CONTENT");
      jest.spyOn(step.docString, "clone");

      const cloned: Step = step.clone();
      expect(cloned.docString).not.toBeNull();
      expect(step.docString.clone).toHaveBeenCalled();
    });

    test("should clone step with comment", () => {
      step.comment = new Comment("# comment");
      jest.spyOn(step.comment, "clone");

      const cloned: Step = step.clone();
      expect(cloned.comment).not.toBeNull();
      expect(step.comment.clone).toHaveBeenCalled();
    });
  });

  describe("replace", () => {
    beforeEach(() => {
      jest.spyOn(common, "replaceAll");
    });

    test("should replace in text", () => {
      step.replace("K", "V");
      expect(common.replaceAll).toHaveBeenCalledWith("DO", "K", "V");
    });

    test("should replace in data table", () => {
      step.dataTable = new DataTable([]);
      jest.spyOn(step.dataTable, "replace").mockReturnValue();

      step.replace("K", "V");
      expect(step.dataTable.replace).toHaveBeenCalledWith("K", "V");
    });

    test("should replace in doc string", () => {
      step.docString = new DocString("CONTENT");
      jest.spyOn(step.docString, "replace").mockReturnValue();

      step.replace("K", "V");
      expect(step.docString.replace).toHaveBeenCalledWith("K", "V");
    });

    test("should replace in comment", () => {
      step.comment = new Comment("# comment");
      jest.spyOn(step.comment, "replace").mockReturnValue();

      step.replace("K", "V");
      expect(step.comment.replace).toHaveBeenCalledWith("K", "V");
    });
  });

  describe("parse", () => {
    beforeEach(() => {
      jest.spyOn(DataTable, "parse");
      jest.spyOn(DocString, "parse");
    });

    test("should throw error if not GherkinStep is passed", () => {
      const obj: GherkinStep = {} as GherkinStep;
      expect(() => Step.parse(obj)).toThrow();
    });

    test("should parse basic data", () => {
      const obj: GherkinStep = {
        keyword: "When",
        text: "DO",
      } as GherkinStep;
      const parsed: Step = Step.parse(obj);
      expect(parsed.keyword).toEqual("When");
      expect(parsed.text).toEqual("DO");
      expect(parsed.dataTable).toBeNull();
      expect(parsed.docString).toBeNull();
      expect(parsed.comment).toBeFalsy();
      expect(DataTable.parse).not.toHaveBeenCalled();
      expect(DocString.parse).not.toHaveBeenCalled();
    });

    test("should parse data table", () => {
      const obj: GherkinStep = {
        keyword: "When",
        text: "DO",
        dataTable: {
          rows: [],
        } as GherkinDataTable,
      } as GherkinStep;
      const parsed: Step = Step.parse(obj);
      expect(parsed.dataTable).not.toBeNull();
      expect(parsed.docString).toBeNull();
      expect(DataTable.parse).toHaveBeenCalledWith(obj.dataTable, undefined);
      expect(DocString.parse).not.toHaveBeenCalled();
    });

    test("should parse doc string", () => {
      const obj: GherkinStep = {
        keyword: "When",
        text: "DO",
        docString: {
          content: "CONTENT",
        } as GherkinDocString,
      } as GherkinStep;
      const parsed: Step = Step.parse(obj);
      expect(parsed.dataTable).toBeNull();
      expect(parsed.docString).not.toBeNull();
      expect(DataTable.parse).not.toHaveBeenCalled();
      expect(DocString.parse).toHaveBeenCalledWith(obj.docString, undefined);
    });

    test("should parse comment right before the step", () => {
      const handler = new GherkinCommentHandler([
        {
          location: { column: 1, line: 41 },
          text: "# comment",
        }
      ]);
      const obj: GherkinStep = {
        keyword: "When",
        text: "DO",
        location: { column: 1, line: 42 },
      } as GherkinStep;
      const parsed: Step = Step.parse(obj, handler);
      expect(parsed.keyword).toEqual("When");
      expect(parsed.text).toEqual("DO");
      expect(parsed.dataTable).toBeNull();
      expect(parsed.docString).toBeNull();
      expect(parsed.comment).not.toBeNull();
      expect(parsed.comment.text).toEqual("# comment");
    });

    test("should parse comment between steps", () => {
      const handler = new GherkinCommentHandler([
        {
          location: { column: 1, line: 39 },
          text: "# comment 39",
        },
        {
          location: { column: 1, line: 41 },
          text: "# comment 41",
        },
      ]);
      const obj: GherkinStep = {
        keyword: "When",
        text: "DO",
        location: { column: 1, line: 42 },
      } as GherkinStep;
      const parsed: Step = Step.parse(obj, handler, { column: 1, line: 38 });
      expect(parsed.keyword).toEqual("When");
      expect(parsed.text).toEqual("DO");
      expect(parsed.dataTable).toBeNull();
      expect(parsed.docString).toBeNull();
      expect(parsed.comment).not.toBeNull();
      expect(parsed.comment.text).toEqual("# comment 39\n\n# comment 41");
    });
  });
});
