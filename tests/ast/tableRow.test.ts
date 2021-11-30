import { TableCell } from "../../src";
import { TableRow } from "../../src";
import { GherkinTableCell, GherkinTableRow } from "../../src/gherkinObject";
import { pruneID } from "../../src/utils";

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
        expect(rowA._id).not.toEqual(rowB._id);
        pruneID(rowA);
        pruneID(rowB);
        expect(rowA.cells).toEqual(rowB.cells);
        expect(rowB).not.toBe(rowA);
    });

    test("should have method to replace value", () => {
        // Given
        const row: TableRow = new TableRow([new TableCell("Hello World!")]);
        // When
        row.replace("o", "X");
        // Then
        expect(row.cells[0].value).toEqual("HellX WXrld!");
    });

    describe("parse", () => {
        test("should throw error if not GherkinTableRow is passed", () => {
            // Given
            const obj: GherkinTableRow = {} as GherkinTableRow;
            // When
            // Then
            expect(() => TableRow.parse(obj)).toThrow();
        });

        test("should parse GherkinTableRow", () => {
            // Given
            const obj: GherkinTableRow = {
                cells: [
                    {
                        value: "Cell",
                    } as GherkinTableCell,
                ],
            } as GherkinTableRow;
            // When
            const row: TableRow = TableRow.parse(obj);
            // Then
            expect(row).toBeDefined();
            expect(row.cells[0].value).toEqual("Cell");
        });
    });
});
