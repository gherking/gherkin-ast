import { cloneArray, normalizeString, replaceAll, replaceArray, GherkinCommentHandler } from "../common";
import { GherkinExamples } from "../gherkinObject";
import { Comment } from "./comment";
import { TableRow } from "./tableRow";
import { Tag } from "./tag";
import { UniqueObject } from "./uniqueObject";

/**
 * Model for Examples table
 */
export class Examples extends UniqueObject {
    public static parse(obj: GherkinExamples, comments?: GherkinCommentHandler): Examples {
        if (!obj || !Array.isArray(obj.tableBody)) {
            throw new TypeError("The given obj is not an Examples!");
        }
        const examples: Examples = new Examples(obj.keyword, obj.name);

        examples.precedingComment = comments?.parseComment(obj.location);
        examples.tagComment = comments?.parseTagComment(obj.tags);

        examples.tags = Tag.parseAll(obj.tags, comments);

        if (obj.tableHeader) {
            examples.header = TableRow.parse(obj.tableHeader, comments);
        }
        examples.body = TableRow.parseAll(obj.tableBody, comments);

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
    /** Comment before all tags */
    public tagComment: Comment;
    /** Comment before the Examples */
    public precedingComment: Comment;

    constructor(keyword: string, name: string) {
        super();

        this.keyword = normalizeString(keyword);
        this.name = normalizeString(name);

        this.header = null;
        this.precedingComment = null;

        this.tags = [];
        this.body = [];
    }

    public clone(): Examples {
        const examples: Examples = new Examples(this.keyword, this.name);

        examples.header = this.header ? this.header.clone() : null;
        examples.precedingComment = this.precedingComment ? this.precedingComment.clone() : null;
        examples.tagComment = this.tagComment ? this.tagComment.clone() : null;

        examples.tags = cloneArray<Tag>(this.tags);
        examples.body = cloneArray<TableRow>(this.body);

        return examples;
    }

    public replace(key: RegExp | string, value: string): void {
        this.name = replaceAll(this.name, key, value);

        this.header && this.header.replace(key, value);
        this.precedingComment && this.precedingComment.replace(key, value);
        this.tagComment && this.tagComment.replace(key, value);

        replaceArray<Tag>(this.tags, key, value);
        replaceArray<TableRow>(this.body, key, value);
    }
}
