import { cloneArray, normalizeString, replaceAll, replaceArray, GherkinCommentHandler } from "../common";
import { GherkinExamples } from "../gherkinObject";
import { Comment } from "./comment";
import { TableRow } from "./tableRow";
import { Tag } from "./tag";
import { UniqueObject } from "./uniqueObject";
import { getDebugger } from "../debug";
const debug = getDebugger("Examples");

/**
 * Model for Examples table
 */
export class Examples extends UniqueObject {
  public static parse(obj: GherkinExamples, comments?: GherkinCommentHandler): Examples {
    debug("parse(obj: %o, comments: %d)", obj, comments?.comments?.length);
    if (!obj || !Array.isArray(obj.tableBody)) {
      throw new TypeError("The given obj is not an Examples!");
    }
    const { location, tags, tableHeader, tableBody, keyword, name } = obj;
    const examples: Examples = new Examples(keyword, name);

    examples.precedingComment = comments?.parseComment(location, tags?.[tags.length - 1]?.location);
    examples.tagComment = comments?.parseTagComment(tags);

    examples.tags = Tag.parseAll(tags, comments);

    if (tableHeader) {
      examples.header = TableRow.parse(tableHeader, comments);
    }
    examples.body = TableRow.parseAll(tableBody, comments);

    debug(
      "parse(this: {keyword: '%s', name: '%s', tags: %d, header: %d, body: %d, precedingComment: '%s', tagComment: '%s'})",
      examples.keyword, examples.name, examples.tags?.length, examples.header?.cells?.length,
      examples.body?.length, examples.precedingComment?.text, examples.tagComment?.text,
    )
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
    debug("constructor(keyword: '%s', name: '%s')", keyword, name);

    this.keyword = normalizeString(keyword);
    this.name = normalizeString(name);

    this.header = null;
    this.precedingComment = null;
    this.tagComment = null;

    this.tags = [];
    this.body = [];
  }

  public clone(): Examples {
    debug(
      "clone(this: {keyword: '%s', name: '%s', tags: %d, header: %d, body: %d, precedingComment: '%s', tagComment: '%s'})",
      this.keyword, this.name, this.tags?.length, this.header?.cells?.length,
      this.body?.length, this.precedingComment?.text, this.tagComment?.text,
    )
    const examples: Examples = new Examples(this.keyword, this.name);

    examples.header = this.header ? this.header.clone() : null;
    examples.precedingComment = this.precedingComment ? this.precedingComment.clone() : null;
    examples.tagComment = this.tagComment ? this.tagComment.clone() : null;

    examples.tags = cloneArray<Tag>(this.tags);
    examples.body = cloneArray<TableRow>(this.body);

    return examples;
  }

  public replace(key: RegExp | string, value: string): void {
    debug("replace(key: '%s', value: '%s')", key, value);
    this.name = replaceAll(this.name, key, value);

    this.header && this.header.replace(key, value);
    this.precedingComment && this.precedingComment.replace(key, value);
    this.tagComment && this.tagComment.replace(key, value);

    replaceArray<Tag>(this.tags, key, value);
    replaceArray<TableRow>(this.body, key, value);
  }
}
