import { cloneArray, replaceArray, GherkinCommentHandler } from "../common";
import { GherkinDataTable } from "../gherkinObject";
import { TableRow } from "./tableRow";
import { UniqueObject } from "./uniqueObject";
import { getDebugger } from "../debug";
const debug = getDebugger("DataTable");

/**
 * Model for DataTable
 */
export class DataTable extends UniqueObject {
  public static parse(obj: GherkinDataTable, comments?: GherkinCommentHandler): DataTable {
    debug("parse(obj: %o, comments: %d)", obj, comments?.comments?.length);
    if (!obj || !Array.isArray(obj.rows)) {
      throw new Error("The given object is not a DataTable!");
    }
    const table: DataTable = new DataTable();

    table.rows = TableRow.parseAll(obj.rows, comments);

    debug("parse(this: {rows: %d})", table.rows.length);
    return table;
  }

  constructor(public rows: TableRow[] = []) {
    super();
    debug("constructor(rows: %d)", rows.length);
  }

  public clone(): DataTable {
    debug("clone(this: {rows: %d})", this.rows.length);
    return new DataTable(cloneArray<TableRow>(this.rows));
  }

  public replace(key: RegExp | string, value: string): void {
    debug("replace(key: '%s', value: '%s')", key, value);
    replaceArray<TableRow>(this.rows, key, value);
  }
}
