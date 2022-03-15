// @ts-ignore
import ObjectSet = require("object-set-type");
import { replaceAll, safeString, GherkinCommentHandler } from "../common";
import { GherkinTag } from "../gherkinObject";
import { Comment } from "./comment";
import { UniqueObject } from "./uniqueObject";
import { getDebugger } from "../debug";
const debug = getDebugger("Tag");

const TAG_W_VALUE = /^@?([^(@]+)\(([^)]+)\)$/i;
const TAG_WO_VALUE = /^@?([^@]+)$/i;

/**
 * Model for Tag
 */
export class Tag extends UniqueObject {
  public static parse(obj: GherkinTag, comments?: GherkinCommentHandler): Tag {
    debug("parse(obj: %o, comments: %d)", obj, comments?.comments?.length);
    if (!obj || !obj.name) {
      throw new TypeError("The given object is not a Tag!");
    }
    const tag = Tag.parseString(obj.name);

    tag.comment = comments?.parseComment(obj.location);

    debug(
      "parse(this: {name: '%s', value: '%s', comment: '%s')",
      tag.name, tag.value, tag.comment?.text,
    );
    return tag;
  }

  public static parseAll(obj: GherkinTag[], comments?: GherkinCommentHandler): Tag[] {
    debug("parseAll(obj: %d, comments: %d)", obj?.length, comments?.comments?.length);
    if (!Array.isArray(obj) || !obj.length) {
      return [];
    }
    return obj.map(o => this.parse(o, comments));
  }

  public static parseString(s?: string): Tag {
    debug("parseString(s: '%s')", s);
    if (!s || typeof s !== "string") {
      throw new TypeError("The given string is not a Gherkin Tag!");
    }
    let m = s.match(TAG_W_VALUE);
    if (m) {
      return new Tag(m[1], m[2]);
    }
    m = s.match(TAG_WO_VALUE);
    const tag = new Tag(m[1]);
    debug(
      "parseString(this: {name: '%s', value: '%s', comment: '%s')",
      tag.name, tag.value, tag.comment?.text,
    );
    return tag;
  }

  /** The name of the tag, e.g. "suite" from "@suite(smoke)" */
  public name: string;
  /** The value of the tag, e.g. "smoke" from "@suite(smoke)" */
  public value: string;

  /** The comment of the tag */
  public comment: Comment;

  constructor(name: string, value?: string) {
    super();
    debug("constructor(name: '%s', value: '%s')", name, value);

    this.name = safeString(name);
    this.value = value;

    this.comment = null;
    debug(
      "constructor(this: {name: '%s', value: '%s', comment: '%s')",
      this.name, this.value, this.comment?.text,
    );
  }

  public clone(): Tag {
    debug(
      "clone(this: {name: '%s', value: '%s', comment: '%s')",
      this.name, this.value, this.comment?.text,
    );
    const tag = new Tag(this.name, this.value);

    tag.comment = this.comment ? this.comment.clone() : null;

    return tag;
  }

  public replace(key: RegExp | string, value: string): void {
    debug("replace(key: '%s', value: '%s')", key, value);
    this.name = replaceAll(this.name, key, value);
    this.value = replaceAll(this.value, key, value);

    this.comment && this.comment.replace(key, value);
  }

  public toString(): string {
    debug(
      "toString(this: {name: '%s', value: '%s')",
      this.name, this.value,
    );
    if (this.value) {
      return `@${this.name}(${this.value})`;
    }
    return `@${this.name}`;
  }
}

export const tag = (name: string, value?: string): Tag => {
  debug("static tag(name: '%s', value: '%s')", name, value);
  return new Tag(name, value);
};

export const removeDuplicateTags = (tags: Tag[]): Tag[] => {
  debug("static removeDuplicateTags(tags: %d)", tags?.length);
  const tagsWithoutID = tags.map(({ name, value }) => ({ name, value }));
  return Array.from(new ObjectSet(tagsWithoutID)).map(({ name, value }) => new Tag(name, value))
};
