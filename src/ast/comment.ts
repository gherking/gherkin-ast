import { normalizeString, replaceAll } from "../common";
import { GherkinComment } from "../gherkinObject";
import { UniqueObject } from "./uniqueObject";
import { getDebugger } from "../debug";
const debug = getDebugger("Comment");

export class Comment extends UniqueObject {
  public static parse(...objs: GherkinComment[]): Comment {
    debug("parse(objs: %d)", objs.length);
    if (!objs.length || objs.some(o => !o.text)) {
      throw new TypeError("The given object is not a Comment!");
    }
    const comment = new Comment(objs.map(o => o.text).join("\n"));
    debug("parse(this: {text: '%s'})", comment.text);
    return comment;
  }

  /** The text of the comment, including '#'. */
  public text: string;

  constructor(text: string) {
    super();
    debug("constructor(text: '%s')", text);

    this.text = normalizeString(text);
  }

  public clone(): Comment {
    debug("clone()");
    return new Comment(this.text);
  }

  public replace(key: RegExp | string, value: string): void {
    debug("replace(key: '%s', value: '%s')", key, value);
    this.text = replaceAll(this.text, key, value);
  }

  public toString(): string {
    debug('toString()');
    return this.text;
  }
}