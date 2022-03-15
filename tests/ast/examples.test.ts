import { Comment, Examples, GherkinCommentHandler } from "../../src";
import { TableCell } from "../../src";
import { TableRow } from "../../src";
import { Tag } from "../../src";
import * as common from "../../src/common";
import { GherkinExamples, GherkinTableRow, GherkinTag } from "../../src/gherkinObject";
import { pruneID } from "../../src/utils";

describe("Examples", () => {
  let example: Examples;

  beforeEach(() => {
    jest.restoreAllMocks();
    example = new Examples(
      "Keyword", "Name",
    );
    example.tags = [new Tag("@tag")];
    example.header = new TableRow([new TableCell("Header")]);
    example.body = [new TableRow([new TableCell("Body")])];
    example.precedingComment = new Comment("# preceding");
    example.tagComment = new Comment("# tag");
  });
  describe("constructor", () => {
    test("should create model of a Scenario example", () => {
      example = new Examples(
        "Keyword", "Name",
      );

      expect(example).toBeDefined();
      expect(example._id).toBeDefined();
      expect(example.keyword).toEqual("Keyword");
      expect(example.name).toEqual("Name");
      expect(example.tags).toEqual([]);
      expect(example.header).toEqual(null);
      expect(example.body).toEqual([]);
    });
  });
  describe("clone", () => {
    let clonedExample: Examples;

    beforeEach(() => {
      jest.spyOn(common, "cloneArray");
      jest.spyOn(example.header, "clone").mockReturnValue({ cells: [] } as TableRow);
      clonedExample = example.clone();
      pruneID(example);
      pruneID(clonedExample);
    });

    test("should clone basic data", () => {
      expect(clonedExample).toBeDefined();
      expect(clonedExample.keyword).toEqual("Keyword");
      expect(clonedExample.name).toEqual("Name");
      expect(clonedExample).not.toBe(example);
    });

    test("should clone header", () => {
      expect(example.header.clone).toHaveBeenCalled();
      expect(clonedExample.header).toEqual({ cells: [] } as TableRow);
    });

    test("should clone tags", () => {
      expect(common.cloneArray).toHaveBeenCalledWith(example.tags);
      expect(clonedExample.tags).toEqual(example.tags);
      expect(clonedExample.tags).not.toBe(example.tags);
    });

    test("should clone body", () => {
      expect(common.cloneArray).toHaveBeenCalledWith(example.body);
      expect(clonedExample.body).toEqual(example.body);
      expect(clonedExample.body).not.toBe(example.body);
    });

    test("should clone comment", () => {
      expect(clonedExample.precedingComment.text).toEqual(example.precedingComment.text);
      expect(clonedExample.precedingComment).not.toBe(example.precedingComment);
      expect(clonedExample.tagComment.text).toEqual(example.tagComment.text);
      expect(clonedExample.tagComment).not.toBe(example.tagComment);
    });
  });

  describe("replace", () => {
    beforeEach(() => {
      jest.spyOn(common, "replaceArray").mockReturnValue();
      jest.spyOn(common, "replaceAll");
    });

    test("should replace based data", () => {
      example.replace("e", "X");
      expect(example.name).toEqual("NamX");
    });

    test("should replace in body", () => {
      example.replace("e", "X");
      expect(common.replaceArray).toHaveBeenCalledWith([expect.objectContaining({ cells: [expect.objectContaining({ value: "Body" })] })], "e", "X");
    });

    test("should replace in tags", () => {
      example.replace("e", "X");
      expect(common.replaceArray).toHaveBeenCalledWith([expect.objectContaining({ name: "@tag" })], "e", "X");
    });

    test("should replace in header", () => {
      jest.spyOn(example.header, "replace").mockReturnValue();
      example.replace("e", "X");
      expect(example.header.replace).toHaveBeenCalledWith("e", "X");
    });

    test("should replace in comments", () => {
      example.replace("e", "X");

      expect(common.replaceAll).toHaveBeenCalledWith("# preceding", "e", "X");
      expect(common.replaceAll).toHaveBeenCalledWith("# tag", "e", "X");
    });
  });

  describe("parse", () => {
    let obj: GherkinExamples;

    beforeEach(() => {
      jest.spyOn(Tag, "parseAll").mockReturnValue([new Tag("N")]);
      jest.spyOn(TableRow, "parse").mockReturnValue(new TableRow([new TableCell("Cell")]));
      obj = {
        name: "Name",
        keyword: "Keyword",
        tableBody: [],
        tableHeader: null,
        location: {
          line: 1,
          column: 2,
        },
      } as GherkinExamples;
    });

    test("should throw error if not GherkinExamples as Examples passed", () => {
      expect(() => Examples.parse({} as GherkinExamples)).toThrow();
    });

    test("should parse basic data", () => {
      jest.spyOn(Tag, "parseAll").mockReturnValue([]);

      const parsed: Examples = Examples.parse(obj);
      expect(parsed).toBeDefined();
      expect(parsed._id).toBeDefined();
      expect(parsed.name).toEqual("Name");
      expect(parsed.keyword).toEqual("Keyword");
      expect(parsed.header).toEqual(null);
      expect(parsed.body).toEqual([]);

      expect(Tag.parseAll).toHaveBeenCalledWith(undefined, undefined);
      expect(parsed.tags).toEqual([]);

      expect(TableRow.parse).not.toHaveBeenCalled();
      expect(parsed.body).toEqual([]);

    });

    test("should parse tags", () => {
      obj.tags = [{ name: "N" } as GherkinTag];
      const parsed: Examples = Examples.parse(obj);
      expect(pruneID(parsed)).toBeDefined();
      expect(Tag.parseAll).toHaveBeenCalledWith(obj.tags, undefined);
      expect(parsed.tags).toEqual([pruneID(new Tag("N"))]);
    });

    test("should parse header", () => {
      obj.tableHeader = {} as GherkinTableRow;
      const parsed: Examples = Examples.parse(obj);
      expect(pruneID(parsed)).toBeDefined();
      expect(TableRow.parse).toHaveBeenCalledWith(obj.tableHeader, undefined);
      expect(parsed.header).toEqual(pruneID(new TableRow([new TableCell("Cell")])));
    });

    test("should parse body", () => {
      obj.tableBody = [{} as GherkinTableRow];
      const parsed: Examples = Examples.parse(obj);
      expect(pruneID(parsed)).toBeDefined();
      expect(TableRow.parse).toHaveBeenCalledWith(obj.tableBody[0], undefined);
      expect(parsed.body).toEqual([pruneID(new TableRow([new TableCell("Cell")]))]);
    });

    test("should parse comments", () => {
      obj.tags = [{ name: "tag", location: { column: 1, line: 40 } }];
      obj.location = { column: 1, line: 42 };
      const comments = new GherkinCommentHandler([
        {
          location: { column: 1, line: 39 },
          text: "# tag",
        },
        {
          location: { column: 1, line: 41 },
          text: "# preceding",
        },
      ]);
      const parsed: Examples = Examples.parse(obj, comments);
      expect(pruneID(parsed)).toBeDefined();
      expect(parsed.precedingComment).toBeDefined();
      expect(parsed.precedingComment.text).toEqual("# preceding");
      expect(parsed.tagComment).toBeDefined();
      expect(parsed.tagComment.text).toEqual("# tag");
    });
  });
});
