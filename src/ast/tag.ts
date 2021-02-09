// @ts-ignore
import ObjectSet = require("object-set-type");
import { replaceAll, safeString } from "../common";
import { GherkinTag } from "../gherkinObject";

const TAG_W_VALUE = /^@?([^(@]+)\(([^)]+)\)$/i;
const TAG_WO_VALUE = /^@?([^@]+)$/i;

/**
 * Model for Tag
 */
export class Tag {
    public static parse(obj?: GherkinTag): Tag {
        if (!obj || !obj.name) {
            throw new TypeError("The given object is not a Tag!");
        }
        return Tag.parseString(obj.name);
    }

    public static parseString(s?: string): Tag {
        if (!s || typeof s !== "string") {
            throw new TypeError("The given string is not a Gherkin Tag!");
        }
        let m = s.match(TAG_W_VALUE);
        if (m) {
            return new Tag(m[1], m[2]);
        }
        m = s.match(TAG_WO_VALUE);
        return new Tag(m[1]);
    }

    public name: string;
    public value: string;

    constructor(name: string, value?: string) {
        this.name = safeString(name);
        this.value = value;
    }

    public clone(): Tag {
        return new Tag(this.name, this.value);
    }

    public replace(key: RegExp | string, value: string): void {
        this.name = replaceAll(this.name, key, value);
        this.value = replaceAll(this.value, key, value);
    }

    public toString(): string {
        if (this.value) {
            return `@${this.name}(${this.value})`;
        }
        return `@${this.name}`;
    }
}

export const tag = (name: string, value?: string): Tag => {
    return new Tag(name, value);
};

export const removeDuplicateTags = (tags: Tag[]): Tag[] => {
    return Array.from(new ObjectSet(tags)) as Tag[];
};
