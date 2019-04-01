import { TableRow } from './tableRow';
import { GherkinDataTable, GherkinTableRow } from '../gherkinObject';
import { replaceArray, cloneArray } from '../common';

export class DataTable {
    public rows: TableRow[];

    constructor(rows: TableRow[] = []) {
        this.rows = rows;
    }

    public clone(): DataTable {
        return new DataTable(cloneArray<TableRow>(this.rows));
    }

    public replace(key: RegExp | string, value: string): void {
        replaceArray<TableRow>(this.rows, key, value);
    }

    public static parse(obj: GherkinDataTable): DataTable {
        if (!obj || !Array.isArray(obj.rows)) {
            throw new Error("The given object is not a DataTable!");
        }
        const table: DataTable = new DataTable();
        table.rows = obj.rows.map((row: GherkinTableRow): TableRow => TableRow.parse(row));
        return table;
    }
}