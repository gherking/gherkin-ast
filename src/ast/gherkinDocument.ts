import { GherkinCommentHandler } from "..";
import { GherkinDocument } from "../gherkinObject";
import { Comment } from "./comment";
import { Feature } from "./feature";
import { UniqueObject } from "./uniqueObject";

/**
 * Model for Document
 */
export class Document extends UniqueObject {
    public static parse(obj: GherkinDocument, comments: GherkinCommentHandler): Document {
        if (!obj || !obj.gherkinDocument) {
            throw new TypeError("The given object is not a GherkinDocument!");
        }
        const document: Document = new Document(obj.gherkinDocument.uri);
        document.feature = Feature.parse(obj.gherkinDocument.feature);
        document.
        return document;
    }

    // TODO
    public startComments: Comment[];
    // TODO
    public endComments: Comment[];

    constructor(public uri: string, public feature: Feature = null) {
        super();
    }

    public clone(): Document {
        const document: Document = new Document(this.uri);
        document.feature = this.feature ? this.feature.clone() : null;
        return document;
    }

    public replace(key: RegExp | string, value: string): void {
        this.feature && this.feature.replace(key, value);
    }
}
