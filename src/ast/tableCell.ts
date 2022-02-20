import { replaceAll } from "../common";
import { GherkinTableCell } from "../gherkinObject";
import { UniqueObject } from "./uniqueObject";

/**
 * Model for TableCell
 */
export class TableCell extends UniqueObject {
  public static parse(obj: GherkinTableCell): TableCell {
    if (!obj || !("value" in obj)) {
      throw new TypeError("The given object is not a TableCell!");
    }
    return new TableCell(obj.value);
  }

  constructor(public value: string) {
    super();
  }

  public clone(): TableCell {
    return new TableCell(this.value);
  }

  public replace(key: RegExp | string, value: string): void {
    this.value = replaceAll(this.value, key, value);
  }
}
