import { cloneArray, replaceArray, GherkinCommentHandler } from "../common";
import { GherkinTableRow } from "../gherkinObject";
import { Comment } from "./comment";
import { TableCell } from "./tableCell";
import { UniqueObject } from "./uniqueObject";

/**
 * Model for TableRow
 */
export class TableRow extends UniqueObject {
  public static parse(obj: GherkinTableRow, comments?: GherkinCommentHandler): TableRow {
    if (!obj || !Array.isArray(obj.cells)) {
      throw new TypeError("The given object is not a TableRow!");
    }
    const row: TableRow = new TableRow();

    row.cells = obj.cells.map(TableCell.parse);

    row.comment = comments?.parseComment(obj.location);

    return row;
  }

  public static parseAll(obj: GherkinTableRow[], comments?: GherkinCommentHandler): TableRow[] {
    if (!Array.isArray(obj) || !obj.length) {
      return [];
    }
    return obj.map(o => this.parse(o, comments));
  }

  /** Comment before the row */
  public comment: Comment;

  constructor(public cells: TableCell[] = []) {
    super();
    this.comment = null;
  }

  public clone(): TableRow {
    const row = new TableRow(cloneArray<TableCell>(this.cells));
    row.comment = this.comment ? this.comment.clone() : null;
    return row;
  }

  public replace(key: RegExp | string, value: string): void {
    replaceArray<TableCell>(this.cells, key, value);
    this.comment && this.comment.replace(key, value);
  }
}
