import { TableCell } from "../../src";
import { GherkinTableCell } from "../../src/gherkinObject";

describe("TableCell", () => {
    test("should create model of a TableCell", () => {
        // Given
        // When
        const cell: TableCell = new TableCell("Cell");
        // Then
        expect(cell).toBeDefined();
        expect(cell.value).toEqual("Cell");
    });

    test("should have a method to clone it", () => {
        // Given
        const cellA: TableCell = new TableCell("A");
        // When
        const cellB: TableCell = cellA.clone();
        // Then
        expect(cellB.value).toEqual(cellA.value);
        expect(cellB).not.toBe(cellA);
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

        test("should hadle empty cells", () => {
            // Given
            const obj: GherkinTableCell = {
                value: "",
            } as GherkinTableCell;
            // When
            const cell: TableCell = TableCell.parse(obj);
            // Then
            expect(cell).toBeDefined();
            expect(cell.value).toEqual("");
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
