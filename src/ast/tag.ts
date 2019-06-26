// @ts-ignore
import ObjectSet = require("object-set-type");
import { replaceAll, safeString } from "../common";
import { GherkinTag } from "../gherkinObject";

/**
 * Model for Tag
 */
export class Tag {
    public static parse(obj?: GherkinTag): Tag {
        if (!obj || !obj.name) {
            throw new TypeError("The given object is not a Tag!");
        }
        return new Tag(obj.name);
    }

    public name: string;

    constructor(name: string) {
        this.name = safeString(name);
    }

    public clone(): Tag {
        return new Tag(this.name);
    }

    public replace(key: RegExp | string, value: string): void {
        this.name = replaceAll(this.name, key, value);
    }

    public toString(): string {
        return `@${this.name}`;
    }
}

export const tag = (name: string, value?: string): Tag => {
    return new Tag(value ? `${name}(${value})` : name);
};

export const removeDuplicateTags = (tags: Tag[]): Tag[] => {
    return Array.from(new ObjectSet(tags)) as Tag[];
};
