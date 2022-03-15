import { GherkinComment, GherkinLocation, GherkinTag } from "./gherkinObject";
import { Comment } from "./ast/comment";
import { getDebugger } from "./debug";
const debug = getDebugger("common");

export const safeString = (s = ""): string => {
  const safe = s.replace(/\s/g, "_");
  debug("safeString(s: '%s') => '%s'", s, safe);
  return safe;
};

export const normalizeString = (s = ""): string => {
  const normal = s.split("\n")
    .map((line: string): string => line.trim())
    .join("\n");
  debug("normalizeString(s: '%s') => '%s'", s, normal);
  return normal;
};

export const replaceAll = (s: string, key: RegExp | string, value: string): string => {
  if (!(key instanceof RegExp)) {
    key = new RegExp(key, "g");
  }
  if (!s || typeof s !== "string") {
    debug("replaceAll(s: '%s', key: '%s', value: '%s') => '%s'", s, key, value, s);
    return s;
  }
  const result = s.replace(key, value);
  debug("replaceAll(s: '%s', key: '%s', value: '%s') => '%s'", s, key, value, result);
  return result;
};

interface Clonable<T> {
  clone(): T;
}

export const cloneArray = <T extends Clonable<T>>(array: T[]): T[] => {
  debug("cloneArray(array: %d)", array?.length);
  return Array.isArray(array) ? array.map((e: T): T => (e as Clonable<T>).clone()) : [];
};

interface Replacable {
  replace(key: RegExp | string, value: string): void;
}
export const replaceArray = <T extends Replacable>(array: T[], key: RegExp | string, value: string): void => {
  debug("replaceArray(array: %d, key: '%s', value: '%s')", array?.length, key, value);
  Array.isArray(array) && array.forEach((e: T): void => {
    e.replace(key, value);
  });
};

export class GherkinCommentHandler {
  public firstLine: number;
  public lastLine: number;

  private debug = getDebugger('GherkinCommentHandler');

  constructor(public comments: GherkinComment[]) {
    this.debug('constructor(comments: %d)', comments?.length);

    this.comments = comments ? [...comments] : [];
    this.firstLine = Infinity;
    this.lastLine = 0;

    if (this.comments.length) {
      this.comments.sort((c1, c2) => c1.location.line - c2.location.line);
    }

    this.debug(
      'constructor(this: {comments: %d, firstLine: %d, lastLine: %d})',
      this.comments.length, this.firstLine, this.lastLine,
    )
  }

  private storeLine(line: number): void {
    this.firstLine = Math.min(this.firstLine, line);
    this.lastLine = Math.max(this.lastLine, line);
    this.debug(
      'storeLine(line: %d) => {firstLine: %d, lastLine: %d}',
      line, this.firstLine, this.lastLine
    )
  }

  public findCommentIndexBefore(location: GherkinLocation): number {
    for (let i = 0; i < this.comments.length; ++i) {
      if (this.comments[i].location.line == location.line - 1) {
        this.debug('findCommentIndexBefore(location: %d) => %d', location?.line, i);
        return i;
      }
    }
    this.debug('findCommentIndexBefore(location: %d) => NOT FOUND', location?.line);
    return -1;
  }

  public popFromIndex(i: number): GherkinComment {
    this.debug('popFromIndex(i: %d)', i);
    return this.comments.splice(i, 1)[0];
  }

  public popCommentsRightBefore(location: GherkinLocation): GherkinComment[] {
    this.storeLine(location.line);
    let i = this.findCommentIndexBefore(location);
    const comments: GherkinComment[] = [];
    if (i > -1) {
      comments.push(this.popFromIndex(i));
      for (--i; i >= 0; --i) {
        if (this.comments[i].location.line < comments[0].location.line - 1) {
          break;
        }
        comments.unshift(this.popFromIndex(i));
      }
    }
    this.debug('popCommentsRightBefore(location: %d) => %d', location?.line, comments.length);
    return comments;
  }

  public parseComment(location: GherkinLocation, from?: GherkinLocation): Comment {
    if (from) {
      return this.parseCommentBetween(from, location);
    }
    const comments = this.popCommentsRightBefore(location);
    if (comments.length) {
      this.debug('parseComment(location: %d) => %d', location?.line, comments.length);
      return Comment.parse(...comments);
    }
    this.debug('parseComment(location: %d) => NOT FOUND', location?.line);
    return null;
  }

  public parseTagComment(tags: GherkinTag[]): Comment {
    if (!Array.isArray(tags) || !tags.length) {
      this.debug('parseTagComment(tags: %d) => NOT TAGS', tags?.length);
      return null;
    }
    this.debug('parseTagComment(tags: %d) => %d', tags.length, tags[0].location.line);
    return this.parseComment(tags[0].location);
  }

  public parseCommentBetween(locA: GherkinLocation, locB: GherkinLocation): Comment {
    if (!locA || !locB) {
      this.debug('parseCommentBetween(locA: %d, locB: %d) => NO LOCS', locA?.line, locB?.line);
      return null;
    }
    this.storeLine(locA.line);
    this.storeLine(locB.line);
    let i = 0;
    const comments: GherkinComment[] = [];
    for (; i < this.comments.length && this.comments[i].location.line < locA.line; ++i);
    for (; i < this.comments.length && this.comments[i].location.line < locB.line;) {
      comments.push(this.popFromIndex(i));
    }
    this.debug('parseCommentBetween(locA: %d, locB: %d) => %d', locA?.line, locB?.line, comments.length);
    return this.parseMultiLineComment(comments);
  }

  public parseStartingComment(): Comment {
    const comments: GherkinComment[] = [];
    for (let i = 0; i < this.comments.length && this.comments[i].location.line < this.firstLine;) {
      comments.push(this.popFromIndex(i));
    }
    this.debug('parseStartingComment() => %d', comments.length);
    return this.parseMultiLineComment(comments);
  }

  public parseEndingComment(): Comment {
    const comments: GherkinComment[] = [];
    let i = 0;
    for (; i < this.comments.length && this.comments[i].location.line < this.lastLine; ++i);
    for (; i < this.comments.length;) {
      comments.push(this.popFromIndex(i));
    }
    this.debug('parseEndingComment() => %d', comments.length);
    return this.parseMultiLineComment(comments);
  }

  private parseMultiLineComment(comments: GherkinComment[]): Comment {
    if (!comments.length) {
      this.debug('parseMultiLineComment(comments: %d) => NO COMMENTS', comments.length);
      return null;
    }
    const lines: string[] = [];
    const firstLine = comments[0].location.line;
    for (const comment of comments) {
      lines[comment.location.line - firstLine] = comment.text;
    }
    const comment = new Comment(lines.join("\n"));
    this.debug("parseMultiLineComment(comments: %d) => '%s'", comments.length, comment.text);
    return comment;
  }
}