import { cloneArray, replaceArray } from "../common";
import { GherkinTableRow } from "../gherkinObject";
import { TableCell } from "./tableCell";
import { UniqueObject } from "./uniqueObject";

/**
 * Model for TableRow
 */
export class TableRow extends UniqueObject {
    public static parse(obj?: GherkinTableRow): TableRow {
        if (!obj || !Array.isArray(obj.cells)) {
            throw new TypeError("The given object is not a TableRow!");
        }
        const row: TableRow = new TableRow();
        row.cells = obj.cells.map(TableCell.parse);
        return row;
    }

    constructor(public cells: TableCell[] = []) {
        super();
    }

    public clone(): TableRow {
        return new TableRow(cloneArray<TableCell>(this.cells));
    }

    public replace(key: RegExp | string, value: string): void {
        replaceArray<TableCell>(this.cells, key, value);
    }
}
