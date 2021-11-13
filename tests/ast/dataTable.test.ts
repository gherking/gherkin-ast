import { DataTable, TableCell, TableRow } from "../../src";
import * as common from "../../src/common";
import { GherkinDataTable, GherkinTableRow } from "../../src/gherkinObject";
import { pruneID } from "../utils";

describe("DataTable", () => {
    const cell: TableCell = new TableCell("Cell");
    const row: TableRow = new TableRow([cell]);

    describe("constructor", () => {
        test("should create model of DataTable", () => {
            // Given
            // When
            const table: DataTable = new DataTable([row]);
            // Then
            expect(table).toBeDefined();
            expect(table._id).toBeDefined();
            expect(table.rows).toEqual([row]);
        });

        test("should initialize DataTable with default rows", () => {
            // Given
            // When
            const table: DataTable = new DataTable();
            // Then
            expect(table).toBeDefined();
            expect(table._id).toBeDefined();
            expect(table.rows).toEqual([]);
        });
    });

    test("should clone DataTable", () => {
        // Given
        jest.spyOn(common, "cloneArray");
        const table: DataTable = new DataTable([row]);
        // When
        const tableB: DataTable = table.clone();
        // Then
        expect(common.cloneArray).toHaveBeenCalledWith(table.rows);
        expect(tableB._id).toBeDefined();
        expect(tableB._id).not.toEqual(table._id);
        expect(pruneID(table)).toEqual(pruneID(tableB));
    });

    test("should replace value in rows", () => {
        // Given
        jest.spyOn(common, "replaceArray");
        const table: DataTable = new DataTable([row]);
        // When
        table.replace("a", "b");
        // Then
        expect(common.replaceArray).toHaveBeenCalledWith(table.rows, "a", "b");
    });

    describe("parse", () => {
        test("should throw error if not GherkinDataTable is passed", () => {
            // Given
            const obj: GherkinDataTable = {} as GherkinDataTable;
            // When
            // Then
            expect(() => DataTable.parse(obj)).toThrow();
        });

        test("should parse GherkinDataTable", () => {
            // Given
            jest.spyOn(TableRow, "parse");
            const obj: GherkinDataTable = {
                rows: [
                    {
                        cells: [],
                    } as GherkinTableRow,
                ],
            } as GherkinDataTable;
            // When
            const table: DataTable = DataTable.parse(obj);
            // Then
            expect(table).toBeDefined();
            expect(table._id).toBeDefined();
            expect(table.rows).toHaveLength(1);
            expect(TableRow.parse).toHaveBeenCalledTimes(1);
        });
    });
});
