import { replaceAll } from '../common';
import { GherkinTableCell } from '../gherkinObject';

export class TableCell {
    public value: string;

    constructor(value: string) {
        this.value = value;
    }

    public clone(): TableCell {
        return new TableCell(this.value);
    }

    public replace(key: RegExp | string, value: string): void {
        this.value = replaceAll(this.value, key, value);
    }

    public static parse(obj: GherkinTableCell): TableCell {
        if (!obj || !obj.value) {
            throw new TypeError("The given object is not a TableCell!");
        }
        return new TableCell(obj.value);
    }
}
