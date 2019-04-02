import { cloneArray, replaceArray } from "../common";
import { GherkinDataTable } from "../gherkinObject";
import { TableRow } from "./tableRow";

export class DataTable {
    public static parse(obj: GherkinDataTable): DataTable {
        if (!obj || !Array.isArray(obj.rows)) {
            throw new Error("The given object is not a DataTable!");
        }
        const table: DataTable = new DataTable();
        table.rows = obj.rows.map(TableRow.parse);
        return table;
    }

    constructor(public rows: TableRow[] = []) { }

    public clone(): DataTable {
        return new DataTable(cloneArray<TableRow>(this.rows));
    }

    public replace(key: RegExp | string, value: string): void {
        replaceArray<TableRow>(this.rows, key, value);
    }
}
