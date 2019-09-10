import { cloneArray, normalizeString, replaceAll, replaceArray } from "../common";
import { GherkinExamples } from "../gherkinObject";
import { TableRow } from "./tableRow";
import { Tag } from "./tag";

/**
 * Model for Examples table
 */
export class Examples {
    public static parse(obj?: GherkinExamples): Examples {
        if (!obj || !Array.isArray(obj.tableBody)) {
            throw new TypeError("The given obj is not an Examples!");
        }
        const examples: Examples = new Examples(obj.keyword, obj.name);
        if (Array.isArray(obj.tags)) {
            examples.tags = obj.tags.map(Tag.parse);
        } else {
            examples.tags = [];
        }
        examples.body = obj.tableBody.map(TableRow.parse);
        if (obj.tableHeader) {
            examples.header = TableRow.parse(obj.tableHeader);
        }
        return examples;
    }

    /** Keyword of the examples table */
    public keyword: "Examples" | "Scenarios" | string;
    /** Name of the examples table */
    public name: string;
    /** Tags of the examples table */
    public tags: Tag[];
    /** Header of the examples table */
    public header: TableRow;
    /** Body of the examples table */
    public body: TableRow[];

    constructor(keyword: string, name: string) {
        this.keyword = normalizeString(keyword);
        this.name = normalizeString(name);
        this.tags = [];
        this.header = null;
        this.body = [];
    }

    public clone(): Examples {
        const examples: Examples = new Examples(this.keyword, this.name);
        examples.tags = cloneArray<Tag>(this.tags);
        examples.header = this.header ? this.header.clone() : null;
        examples.body = cloneArray<TableRow>(this.body);
        return examples;
    }

    public replace(key: RegExp | string, value: string): void {
        this.name = replaceAll(this.name, key, value);
        replaceArray<Tag>(this.tags, key, value);
        replaceArray<TableRow>(this.body, key, value);
        this.header && this.header.replace(key, value);
    }
}
