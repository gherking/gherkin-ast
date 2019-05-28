import {Examples} from "../../src/ast/examples";
import * as common from "../../src/common";
import {Tag} from "../../src/ast/tag";
import {TableRow} from "../../src/ast/tableRow";
import {TableCell} from "../../src/ast/tableCell";
import {GherkinExamples, GherkinTableRow, GherkinTag} from "../../src/gherkinObject";

describe("Examples", () => {
    let example: Examples;

    beforeEach(() => {
        jest.restoreAllMocks();
        example = new Examples(
            "Keyword", "Name",
        );
    });
    describe("constructor", () => {
        test("should create model of a Scenario example", () => {

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
            example.keyword = "Keyword";
            example.name = "Name";
            example.tags = [new Tag("@tag")];
            example.header = new TableRow([new TableCell("Header")]);
            example.body = [new TableRow([new TableCell("Body")])];
            clonedExample = example.clone();
        });

        test("should clone basic data", () => {
            expect(clonedExample).toBeDefined();
            expect(clonedExample.keyword).toEqual("Keyword");
            expect(clonedExample.name).toEqual("Name");
            expect(clonedExample.header).toEqual(example.header);
            expect(clonedExample).not.toBe(example);
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
            /*example.tags = [{ name: "T1" } as Tag];
            example.header = {
                cells: [{
                    value: "Cell"
                } as TableCell]
            } as TableRow;*/
            //example.replace("e", "X");
        });

        test("should replace based data", () => {
            example.replace("e", "X");
            expect(example.name).toEqual("NamX");
        });

        test("should replace in body", () => {
            example.body = [
                {
                    cells: [
                        {
                            value: "Cell"
                        } as TableCell
                    ]
                } as TableRow
            ];
            example.replace("e", "X");
            expect(common.replaceArray).toHaveBeenCalledWith([{cells: [{value: "Cell"}]}], "e", "X");
        });

        test("should replace in tags", () => {
            example.tags = [{
                name: "T1"
            } as Tag];
            example.replace("e", "X");
            expect(common.replaceArray).toHaveBeenCalledWith([{ name: "T1" }], "e", "X");
        });

        test("should replace in header", () => {
            example.header = {
                cells: [{
                    value: "Cell"
                } as TableCell]
            } as TableRow;
            jest.spyOn(example.header, "replace").mockReturnValue();
            example.replace("e", "X");
            //expect(common.replaceArray).toHaveBeenCalledWith([{value: "Cell"}], "e", "X");
            expect(example.header.replace).toHaveBeenCalledWith("e", "X")
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
                location: {
                    line: 1,
                    column: 2
                }
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
            obj.tags = [{ name: "N" } as GherkinTag];
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
            expect(parsed.header).toEqual({cells:[new TableCell("Cell")]});
        });
    });
});