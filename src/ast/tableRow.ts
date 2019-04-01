import { TableCell } from './tableCell';
import { GherkinTableRow, GherkinTableCell } from '../gherkinObject';
import { cloneArray, replaceArray } from '../common';

export class TableRow {
    public cells: TableCell[];

    constructor(cells: TableCell[] = []) {
        this.cells = cells;
    }

    public clone(): TableRow {
        return new TableRow(cloneArray<TableCell>(this.cells));
    }

    public replace(key: RegExp | string, value: string): void {
        replaceArray<TableCell>(this.cells, key, value);
    }

    public static parse(obj?: GherkinTableRow): TableRow {
        if (!obj || !Array.isArray(obj.cells)) {
            throw new TypeError("The given object is not a TableRow!");
        }
        const row: TableRow = new TableRow();
        row.cells = obj.cells.map((cell: GherkinTableCell): TableCell => TableCell.parse(cell));
        return row;
    }
}
