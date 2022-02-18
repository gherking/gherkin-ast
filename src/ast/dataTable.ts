import { cloneArray, replaceArray, GherkinCommentHandler } from "../common";
import { GherkinDataTable } from "../gherkinObject";
import { TableRow } from "./tableRow";
import { UniqueObject } from "./uniqueObject";

/**
 * Model for DataTable
 */
export class DataTable extends UniqueObject {
    public static parse(obj: GherkinDataTable, comments?: GherkinCommentHandler): DataTable {
        if (!obj || !Array.isArray(obj.rows)) {
            throw new Error("The given object is not a DataTable!");
        }
        const table: DataTable = new DataTable();
        
        table.rows = TableRow.parseAll(obj.rows, comments);
        
        return table;
    }

    constructor(public rows: TableRow[] = []) {
        super();
    }

    public clone(): DataTable {
        return new DataTable(cloneArray<TableRow>(this.rows));
    }

    public replace(key: RegExp | string, value: string): void {
        replaceArray<TableRow>(this.rows, key, value);
    }
}
