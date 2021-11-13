import { normalizeString, replaceAll } from "../common";
import { GherkinDocString } from "../gherkinObject";
import { UniqueObject } from "./uniqueObject";

/**
 * Model for DocString
 */
export class DocString extends UniqueObject {
    public static parse(obj: GherkinDocString): DocString {
        if (!obj || !obj.content) {
            throw new TypeError("The given object is not a DocString!");
        }
        return new DocString(obj.content, obj.delimiter);
    }
    /** Content of the DocString */
    public content: string;
    /** Delimiter of the DocString */
    public delimiter: string;

    constructor(content: string, delimiter = "\"\"\"") {
        super();
        this.content = normalizeString(content);
        this.delimiter = delimiter;
    }

    public clone(): DocString {
        return new DocString(this.content, this.delimiter);
    }

    public replace(key: RegExp | string, value: string): void {
        this.content = replaceAll(this.content, key, value);
    }
}
