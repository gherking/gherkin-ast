import { normalizeString, replaceAll, GherkinCommentHandler } from "../common";
import { GherkinDocString } from "../gherkinObject";
import { Comment } from "./comment";
import { UniqueObject } from "./uniqueObject";

/**
 * Model for DocString
 */
export class DocString extends UniqueObject {
    public static parse(obj: GherkinDocString, comments?: GherkinCommentHandler): DocString {
        if (!obj || !obj.content) {
            throw new TypeError("The given object is not a DocString!");
        }
        const docString = new DocString(obj.content, obj.delimiter, obj.mediaType);
        
        docString.comment = comments?.parseComment(obj.location);
        
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
        this.content = normalizeString(content);
        this.delimiter = delimiter;
        this.mediaType = mediaType;
    }

    public clone(): DocString {
        const docString = new DocString(this.content, this.delimiter, this.mediaType);
        docString.comment = this.comment ? this.comment.clone() : null;
        return docString;
    }

    public replace(key: RegExp | string, value: string): void {
        this.content = replaceAll(this.content, key, value);
        this.comment && this.comment.replace(key, value);
    }
}
