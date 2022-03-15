import { normalizeString, replaceAll, GherkinCommentHandler } from "../common";
import { GherkinDocString } from "../gherkinObject";
import { Comment } from "./comment";
import { UniqueObject } from "./uniqueObject";
import { getDebugger } from "../debug";
const debug = getDebugger("DocString");

/**
 * Model for DocString
 */
export class DocString extends UniqueObject {
  public static parse(obj: GherkinDocString, comments?: GherkinCommentHandler): DocString {
    debug("parse(obj: %o, comments: %d)", obj, comments?.comments?.length);
    if (!obj || !obj.content) {
      throw new TypeError("The given object is not a DocString!");
    }
    const docString = new DocString(obj.content, obj.delimiter, obj.mediaType);

    docString.comment = comments?.parseComment(obj.location);

    debug(
      "parse(this: {content: '%s', delimiter: '%s', mediaType: '%s', comment: '%s'})",
      docString.content, docString.delimiter, docString.mediaType,
      docString.comment?.text,
    );
    return docString;
  }

  /** Content of the DocString */
  public content: string;
  /** Delimiter of the DocString */
  public delimiter: string;
  /** Media type of the DocString */
  public mediaType: string;

  /** Comment of the DocString */
  public comment: Comment;

  constructor(content: string, delimiter = "\"\"\"", mediaType: string = null) {
    super();
    debug(
      "constructor(content: '%s', delimiter: '%s', mediaType: '%s')",
      content, delimiter, mediaType,
    )
    this.content = normalizeString(content);
    this.delimiter = delimiter;
    this.mediaType = mediaType;
  }

  public clone(): DocString {
    debug(
      "clone(this: {content: '%s', delimiter: '%s', mediaType: '%s', comment: '%s'})",
      this.content, this.delimiter, this.mediaType, this.comment?.text,
    );
    const docString = new DocString(this.content, this.delimiter, this.mediaType);

    docString.comment = this.comment ? this.comment.clone() : null;

    return docString;
  }

  public replace(key: RegExp | string, value: string): void {
    debug("replace(key: '%s', value: '%s')", key, value);
    this.content = replaceAll(this.content, key, value);

    this.comment && this.comment.replace(key, value);
  }
}
