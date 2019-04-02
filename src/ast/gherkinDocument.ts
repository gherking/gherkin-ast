import { GherkinDocument } from "../gherkinObject";
import { Feature } from "./feature";

// TODO: Juci
export class Document {
    public static parse(obj?: GherkinDocument) {
        if (!obj || !obj.gherkinDocument) {
            throw new TypeError("The given object is not a GherkinDocument!");
        }
        const document: Document = new Document(obj.gherkinDocument.uri);
        document.feature = Feature.parse(obj.gherkinDocument.feature);
        return document;
    }

    constructor(public uri: string, public feature: Feature = null) { }

    public clone(): Document {
        const document: Document = new Document(this.uri);
        document.feature = this.feature ? this.feature.clone() : null;
        return document;
    }

    public replace(key: RegExp | string, value: string): void {
        this.feature && this.feature.replace(key, value);
    }
}
