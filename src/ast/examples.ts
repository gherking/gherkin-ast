import { Tag } from './tag';
import { TableRow } from './tableRow';
import { normalizeString, replaceAll, cloneArray, replaceArray } from '../common';
import { GherkinExamples, GherkinTag, GherkinTableRow } from '../gherkinObject';
//TODO: Sandor
export class Examples {
    public keyword: string;
    public name: string;
    public tags: Tag[];
    public header: TableRow;
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

    public static parse(obj?: GherkinExamples): Examples {
        if (!obj || !obj.tableBody) {
            throw new TypeError("The given obj is not an Examples!");
        }
        const examples: Examples = new Examples(obj.keyword, obj.name);
        if (Array.isArray(obj.tags)) {
            examples.tags = obj.tags.map((tag: GherkinTag): Tag => Tag.parse(tag));
        }
        if (Array.isArray(obj.tableBody)) {
            examples.body = obj.tableBody.map((row: GherkinTableRow): TableRow => TableRow.parse(row));
        }
        if (obj.tableHeader) {
            examples.header = TableRow.parse(obj.tableHeader);
        }
        return examples;
    }
}
