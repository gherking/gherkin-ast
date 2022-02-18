import { GherkinComment, GherkinLocation, GherkinTag } from ".";
import { Comment } from "./ast/comment";

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
    private firstLine: number;
    private lastLine: number;

    constructor(public comments: GherkinComment[]) {
        this.comments = comments ? [...comments] : [];
        this.firstLine = Infinity;
        this.lastLine = 0;
    }

    private storeLine(line: number): void {
        this.firstLine = Math.min(this.firstLine, line);
        this.lastLine = Math.max(this.lastLine, line);
    }

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
        this.storeLine(location.line);
        let i = this.findCommentIndexBefore(location);
        const comments: GherkinComment[] = [];
        if (i > -1) {
            comments.push(this.popFromIndex(i)); // take out the one found
            for (--i; i >= 0; --i) {
                if (this.comments[i].location.line < comments[0].location.line - 1) {
                    break;
                }
                comments.unshift(this.popFromIndex(i));
            }
        }
        return comments;
    }

    public parseComment(location: GherkinLocation): Comment {
        const comments = this.popCommentsRightBefore(location);
        if (comments.length) {
            return Comment.parse(...comments);
        }
        return null;
    }

    public parseTagComment(tags: GherkinTag[]): Comment {
        if (!Array.isArray(tags) || !tags.length) {
            return null;
        }
        return this.parseComment(tags[0].location);
    }

    public parseCommentBetween(locA: GherkinLocation, locB: GherkinLocation): Comment {
        this.storeLine(locA.line);
        this.storeLine(locB.line);
        let i = 0;
        const comments: GherkinComment[] = [];
        for (; i < this.comments.length && this.comments[i].location.line < locA.line; ++i);
        for (; i < this.comments.length && this.comments[i].location.line < locB.line;) {
            comments.push(this.popFromIndex(i));
        }
        return this.parseMultiLineComment(comments);
    }

    public parseStartingComment(): Comment {
        const comments: GherkinComment[] = [];
        for (let i = 0; i < this.comments.length && this.comments[i].location.line < this.firstLine;) {
            comments.push(this.popFromIndex(i));
        }
        return this.parseMultiLineComment(comments);
    }

    public parseEndingComment(): Comment {
        const comments: GherkinComment[] = [];
        let i = 0;
        for (; i < this.comments.length && this.comments[i].location.line < this.lastLine; ++i);
        for (; i < this.comments.length;) {
            comments.push(this.popFromIndex(i));
        }
        return this.parseMultiLineComment(comments);
    }

    private parseMultiLineComment(comments: GherkinComment[]): Comment {
        if (!comments.length) {
            return null;
        }
        const lines: string[] = [];
        const firstLine = comments[0].location.line;
        for (const comment of comments) {
            lines[comment.location.line - firstLine] = comment.text;
        }
        return new Comment(lines.join("\n"));
    }
}