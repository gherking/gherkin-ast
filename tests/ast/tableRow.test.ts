import { TableCell } from "../../src";
import { TableRow } from "../../src";
import { GherkinTableCell } from "../../src/gherkinObject";

describe("TableRow", () => {
    test("should create model of a TableRow", () => {
        // Given
        // When
        const row: TableRow = new TableRow();
        // Then
        expect(row).toBeDefined();
        expect(row.cells).toEqual([]);
    });

    test("should have a method to clone it", () => {
        // Given
        const rowA: TableRow = new TableRow([new TableCell("cell")]);
        // When
        const rowB: TableRow = rowA.clone();
        // Then
        expect(rowA.cells).toEqual(rowB.cells);
        expect(rowB).not.toBe(rowA);
    });

    test("should have method to replace value", () => {
        // Given
        const cell: TableCell = new TableCell("Hello World!");
        // When
        cell.replace("o", "X");
        // Then
        expect(cell.value).toEqual("HellX WXrld!");
    });

    describe("parse", () => {
        test("should throw error if not GherkinTableCell is passed", () => {
            // Given
            const obj: GherkinTableCell = {} as GherkinTableCell;
            // When
            // Then
            expect(() => TableCell.parse(obj)).toThrow();
        });

        test("should parse GherkinTableCell", () => {
            // Given
            const obj: GherkinTableCell = {
                value: "Cell",
            } as GherkinTableCell;
            // When
            const cell: TableCell = TableCell.parse(obj);
            // Then
            expect(cell).toBeDefined();
            expect(cell.value).toEqual("Cell");
        });
    });
});
