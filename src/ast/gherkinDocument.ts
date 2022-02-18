import { GherkinDocument } from "../gherkinObject";
import { GherkinCommentHandler } from "../common";
import { Comment } from "./comment";
import { Feature } from "./feature";
import { UniqueObject } from "./uniqueObject";

/**
 * Model for Document
 */
export class Document extends UniqueObject {
    public static parse(obj: GherkinDocument): Document {
        if (!obj || !obj.gherkinDocument) {
            throw new TypeError("The given object is not a GherkinDocument!");
        }
        const comments: GherkinCommentHandler = new GherkinCommentHandler(obj.gherkinDocument?.comments);
        const document: Document = new Document(obj.gherkinDocument.uri);

        document.feature = Feature.parse(obj.gherkinDocument.feature, comments);

        document.startComment = comments.parseStartingComment();
        document.endComment = comments.parseEndingComment();

        return document;
    }

    /** Comment at the start of the feature file */
    public startComment: Comment;
    /** Comment at the end of the feature file */
    public endComment: Comment;

    constructor(public uri: string, public feature: Feature = null) {
        super();

        this.startComment = null;
        this.endComment = null;
    }

    public clone(): Document {
        const document: Document = new Document(this.uri);

        document.feature = this.feature ? this.feature.clone() : null;
        document.startComment = this.startComment ? this.startComment.clone() : null;
        document.endComment = this.endComment ? this.endComment.clone() : null;

        return document;
    }

    public replace(key: RegExp | string, value: string): void {
        this.feature && this.feature.replace(key, value);
        this.startComment && this.startComment.replace(key, value);
        this.endComment && this.endComment.replace(key, value);
    }
}
