import { Examples } from "../../src";
import { TableCell } from "../../src";
import { TableRow } from "../../src";
import { Tag } from "../../src";
import * as common from "../../src/common";
import { GherkinExamples, GherkinTableRow, GherkinTag } from "../../src/gherkinObject";

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
    });
    describe("constructor", () => {
        test("should create model of a Scenario example", () => {
            example = new Examples(
                "Keyword", "Name",
            );

            expect(example).toBeDefined();
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
            clonedExample = example.clone();
        });

        test("should clone basic data", () => {
            expect(clonedExample).toBeDefined();
            expect(clonedExample.keyword).toEqual("Keyword");
            expect(clonedExample.name).toEqual("Name");
            expect(clonedExample).not.toBe(example);
        });

        test("should clone header", () => {
            expect(common.cloneArray).toHaveBeenCalledWith(example.header.cells);
            expect(clonedExample.header).toEqual(example.header);
            expect(clonedExample.header).not.toBe(example.header);
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
    });

    describe("replace", () => {
        beforeEach(() => {
            jest.spyOn(common, "replaceArray").mockReturnValue();
        });

        test("should replace based data", () => {
            example.replace("e", "X");
            expect(example.name).toEqual("NamX");
        });

        test("should replace in body", () => {
            example.replace("e", "X");
            expect(common.replaceArray).toHaveBeenCalledWith([{cells: [{value: "Body"}]}], "e", "X");
        });

        test("should replace in tags", () => {
            example.replace("e", "X");
            expect(common.replaceArray).toHaveBeenCalledWith([{name: "@tag"}], "e", "X");
        });

        test("should replace in header", () => {
            jest.spyOn(example.header, "replace").mockReturnValue();
            example.replace("e", "X");
            expect(example.header.replace).toHaveBeenCalledWith("e", "X");
        });
    });

    describe("parse", () => {
        let obj: GherkinExamples;

        beforeEach(() => {
            jest.spyOn(Tag, "parse").mockReturnValue(new Tag("N"));
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
            const parsed: Examples = Examples.parse(obj);
            expect(parsed).toBeDefined();
            expect(parsed.name).toEqual("Name");
            expect(parsed.keyword).toEqual("Keyword");
            expect(parsed.header).toEqual(null);
            expect(parsed.body).toEqual([]);

            expect(Tag.parse).not.toHaveBeenCalled();
            expect(parsed.tags).toEqual([]);

            expect(TableRow.parse).not.toHaveBeenCalled();
            expect(parsed.body).toEqual([]);

        });

        test("should parse tags", () => {
            obj.tags = [{name: "N"} as GherkinTag];
            const parsed: Examples = Examples.parse(obj);
            expect(parsed).toBeDefined();
            expect(Tag.parse).toHaveBeenCalledWith(obj.tags[0], 0, obj.tags);
            expect(parsed.tags).toEqual([new Tag("N")]);
        });

        test("should parse header", () => {
            obj.tableHeader = {} as GherkinTableRow;
            const parsed: Examples = Examples.parse(obj);
            expect(parsed).toBeDefined();
            expect(TableRow.parse).toHaveBeenCalledWith(obj.tableHeader);
            expect(parsed.header).toEqual({cells: [new TableCell("Cell")]});
        });
    });
});
