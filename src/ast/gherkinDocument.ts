import { Feature } from './feature';
import { GherkinDocument } from '../gherkinObject';

export class Document {
    public uri: string;
    public feature: Feature;

    constructor(uri: string) {
        this.uri = uri;
        this.feature = null;
    }

    public clone(): Document {
        const document: Document = new Document(this.uri);
        document.feature = this.feature ? this.feature.clone() : null;
        return document;
    }

    public replace(key: RegExp | string, value: string): void {
        this.feature && this.feature.replace(key, value);
    }

    public static parse(obj?: GherkinDocument) {
        if (!obj || !obj.gherkinDocument) {
            throw new TypeError("The given object is not a GherkinDocument!");
        }
        const document: Document = new Document(obj.gherkinDocument.uri);
        document.feature = Feature.parse(obj.gherkinDocument.feature);
        return document;
    }
}
