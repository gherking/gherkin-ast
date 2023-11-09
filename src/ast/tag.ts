// @ts-ignore
import ObjectSet = require("object-set-type");
import {GherkinCommentHandler, replaceAll, safeString} from "../common";
import {GherkinTag} from "../gherkinObject";
import {Comment} from "./comment";
import {UniqueObject} from "./uniqueObject";
import {getDebugger} from "../debug";
import config, {TagFormat} from "../parseConfig";

const debug = getDebugger("Tag");

interface TagFormatHandler {
  parse(s: string): Tag;
  toString(tag: Tag): string;
}

const tagFormats: Map<TagFormat, TagFormatHandler> = new Map<TagFormat, TagFormatHandler>();

tagFormats.set(TagFormat.PARAMETERLESS, {
  parse(s: string): Tag {
    return new Tag(s.match(/^@?(?<name>[^@]+)$/i)[1]);
  },
  toString(tag: Tag): string {
    return `@${tag.name}`;
  }
});

tagFormats.set(TagFormat.FUNCTIONAL, {
  parse(s: string): Tag {
    const m = s.match(/^@?(?<name>[^(@]+)\((?<value>[^)]+)\)$/i);
    if (m) {
      return new Tag(m[1], m[2]);
    }
    return tagFormats.get(TagFormat.PARAMETERLESS).parse(s);
  },
  toString(tag: Tag): string {
    if (tag.value === undefined) {
      return tagFormats.get(TagFormat.PARAMETERLESS).toString(tag);
    }
    return `@${tag.name}(${tag.value})`;
  }
});

tagFormats.set(TagFormat.ASSIGNMENT, {
  parse(s: string): Tag {
    const m = s.match(/^@?(?<name>[^=@]+)=(?<value>.+)$/i);
    if (m) {
      return new Tag(m[1], m[2]);
    }
    return tagFormats.get(TagFormat.PARAMETERLESS).parse(s);
  },
  toString(tag: Tag): string {
    if (tag.value === undefined) {
      return tagFormats.get(TagFormat.PARAMETERLESS).toString(tag);
    }
    return `@${tag.name}=${tag.value}`;
  }
});

tagFormats.set(TagFormat.UNDERSCORE, {
  parse(s: string): Tag {
    const m = s.match(/^@?(?<name>[^_@]+)_(?<value>.+)$/i);
    if (m) {
      return new Tag(m[1], m[2]);
    }
    return tagFormats.get(TagFormat.PARAMETERLESS).parse(s);
  },
  toString(tag: Tag): string {
    if (!tag.value) {
      return tagFormats.get(TagFormat.PARAMETERLESS).toString(tag);
    }
    return `@${tag.name}_${tag.value}`;
  }
});

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
    const {tagFormat} = config.get();
    if (!tagFormats.has(tagFormat)) {
      throw new TypeError("The given tag format is not valid!");
    }
    const tag = tagFormats.get(tagFormat).parse(s);
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
    const {tagFormat} = config.get();
    if (!tagFormats.has(tagFormat)) {
      throw new TypeError("The given tag format is not valid!");
    }
    return tagFormats.get(tagFormat).toString(this);
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
