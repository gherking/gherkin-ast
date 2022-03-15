import { replaceAll } from "../common";
import { GherkinTableCell } from "../gherkinObject";
import { UniqueObject } from "./uniqueObject";
import { getDebugger } from "../debug";
const debug = getDebugger("TableCell");

/**
 * Model for TableCell
 */
export class TableCell extends UniqueObject {
  public static parse(obj: GherkinTableCell): TableCell {
    debug("parse(obj: %o)", obj);
    if (!obj || !("value" in obj)) {
      throw new TypeError("The given object is not a TableCell!");
    }
    const cell = new TableCell(obj.value);
    debug("parse(this: {value: '%s'})", cell.value);
    return cell;
  }

  constructor(public value: string) {
    super();
    debug("constructor(value: '%s')", value);
  }

  public clone(): TableCell {
    debug("clone(this: {value: '%s'})", this.value);
    return new TableCell(this.value);
  }

  public replace(key: RegExp | string, value: string): void {
    debug("replace(key: '%s', value: '%s')", key, value);
    this.value = replaceAll(this.value, key, value);
  }
}
