import { GherkinComment, GherkinLocation } from ".";

export const safeString = (s = ""): string => s.replace(/\s/g, "_");

export const normalizeString = (s = ""): string => {
    return s.split("\n")
        .map((line: string): string => line.trim())
        .join("\n");
};

export const replaceAll = (s: string, key: RegExp | string, value: string): string => {
    if (!(key instanceof RegExp)) {
        key = new RegExp(key, "g");
    }
    if (!s || typeof s !== "string") {
        return s;
    }
    return s.replace(key, value);
};

interface Clonable<T> {
    clone(): T;
}
export const cloneArray = <T extends Clonable<T>>(array: T[]): T[] => {
    return Array.isArray(array) ? array.map((e: T): T => (e as Clonable<T>).clone()) : [];
};

interface Replacable {
    replace(key: RegExp | string, value: string): void;
}
export const replaceArray = <T extends Replacable>(array: T[], key: RegExp | string, value: string): void => {
    Array.isArray(array) && array.forEach((e: T): void => {
        e.replace(key, value);
    });
};

export class GherkinCommentHandler {
    constructor(public comments: GherkinComment[]) { }

    public findCommentIndexBefore(location: GherkinLocation): number {
        for (let i = 0; i < this.comments.length; ++i) {
            if (this.comments[i].location.line == location.line - 1) {
                return i;
            }
        }
        return -1;
    }

    public popFromIndex(i: number): GherkinComment {
        return this.comments.splice(i, 1)[0];
    }

    public popCommentsRightBefore(location: GherkinLocation): GherkinComment[] {
        let i = this.findCommentIndexBefore(location);
        const comments: GherkinComment[] = [];
        if (i > -1) {
            comments.push(this.popFromIndex(i)); // take out the one found
            for (--i; i >= 0; --i) {
                if (this.comments[i].location.line <= comments[0].location.line - 1) {
                    break;
                }
                comments.unshift(this.popFromIndex(i));
            }
        }
        return comments;
    }
}