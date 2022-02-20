// @ts-ignore
import ObjectSet = require("object-set-type");
import { GherkinCommentHandler } from "..";
import { replaceAll, safeString } from "../common";
import { GherkinTag } from "../gherkinObject";
import { Comment } from "./comment";
import { UniqueObject } from "./uniqueObject";

const TAG_W_VALUE = /^@?([^(@]+)\(([^)]+)\)$/i;
const TAG_WO_VALUE = /^@?([^@]+)$/i;

/**
 * Model for Tag
 */
export class Tag extends UniqueObject {
  public static parse(obj: GherkinTag, comments?: GherkinCommentHandler): Tag {
    if (!obj || !obj.name) {
      throw new TypeError("The given object is not a Tag!");
    }
    const tag = Tag.parseString(obj.name);
        
    tag.comment = comments?.parseComment(obj.location);
        
    return tag;
  }

  public static parseAll(obj: GherkinTag[], comments?: GherkinCommentHandler): Tag[] {
    if (!Array.isArray(obj) || !obj.length) {
      return [];
    }
    return obj.map(o => this.parse(o, comments));
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
  public comment: Comment;

  constructor(name: string, value?: string) {
    super();
    this.name = safeString(name);
    this.value = value;
    this.comment = null;
  }

  public clone(): Tag {
    const tag = new Tag(this.name, this.value);
    tag.comment = this.comment ? this.comment.clone() : null;
    return tag;
  }

  public replace(key: RegExp | string, value: string): void {
    this.name = replaceAll(this.name, key, value);
    this.value = replaceAll(this.value, key, value);
    this.comment && this.comment.replace(key, value);
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
  const tagsWithoutID = tags.map(({ name, value }) => ({ name, value }));
  return Array.from(new ObjectSet(tagsWithoutID)).map(({ name, value }) => new Tag(name, value))
};
