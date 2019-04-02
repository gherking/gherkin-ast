import { replaceAll } from "../common";
import { GherkinTableCell } from "../gherkinObject";

export class TableCell {
    public static parse(obj: GherkinTableCell): TableCell {
        if (!obj || !obj.value) {
            throw new TypeError("The given object is not a TableCell!");
        }
        return new TableCell(obj.value);
    }

    constructor(public value: string) { }

    public clone(): TableCell {
        return new TableCell(this.value);
    }

    public replace(key: RegExp | string, value: string): void {
        this.value = replaceAll(this.value, key, value);
    }
}
