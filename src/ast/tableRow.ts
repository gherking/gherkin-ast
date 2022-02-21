import { cloneArray, replaceArray, GherkinCommentHandler } from "../common";
import { GherkinTableRow } from "../gherkinObject";
import { Comment } from "./comment";
import { TableCell } from "./tableCell";
import { UniqueObject } from "./uniqueObject";
import { getDebugger } from "../debug";
const debug = getDebugger("TableRow");

/**
 * Model for TableRow
 */
export class TableRow extends UniqueObject {
  public static parse(obj: GherkinTableRow, comments?: GherkinCommentHandler): TableRow {
    debug("parse(obj: %o, comments: %d)", obj, comments?.comments?.length);
    if (!obj || !Array.isArray(obj.cells)) {
      throw new TypeError("The given object is not a TableRow!");
    }
    const row: TableRow = new TableRow();

    row.cells = obj.cells.map(TableCell.parse);

    row.comment = comments?.parseComment(obj.location);

    debug(
      "parse(this: {cells: %d, comment: '%s'})",
      row.cells.length, row.comment?.text,
    );
    return row;
  }

  public static parseAll(obj: GherkinTableRow[], comments?: GherkinCommentHandler): TableRow[] {
    debug("parse(obj: %d, comments: %d)", obj?.length, comments?.comments?.length);
    if (!Array.isArray(obj) || !obj.length) {
      return [];
    }
    return obj.map(o => this.parse(o, comments));
  }

  /** Comment before the row */
  public comment: Comment;

  constructor(public cells: TableCell[] = []) {
    super();
    debug("constructor(cells: %d)", cells.length);

    this.comment = null;
    debug(
      "constructor(this: {cells: %d, comment: '%s'})",
      this.cells.length, this.comment?.text,
    );
  }

  public clone(): TableRow {
    debug(
      "clone(this: {cells: %d, comment: '%s'})",
      this.cells.length, this.comment?.text,
    );
    const row = new TableRow(cloneArray<TableCell>(this.cells));

    row.comment = this.comment ? this.comment.clone() : null;

    return row;
  }

  public replace(key: RegExp | string, value: string): void {
    debug("replace(key: '%s', value: '%s')", key, value);
    replaceArray<TableCell>(this.cells, key, value);

    this.comment && this.comment.replace(key, value);
  }
}
