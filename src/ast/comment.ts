import { normalizeString, replaceAll } from "../common";
import { GherkinComment } from "../gherkinObject";
import { UniqueObject } from "./uniqueObject";

export class Comment extends UniqueObject {
  public static parse(...objs: GherkinComment[]): Comment {
    if (!objs.length || objs.some(o => !o.text)) {
      throw new TypeError("The given object is not a Tag!");
    }
    return new Comment(objs.map(o => o.text).join("\n"));
  }

  public text: string;

  constructor(text: string) {
    super();
    this.text = normalizeString(text);
  }

  public clone(): Comment {
    return new Comment(this.text);
  }

  public replace(key: RegExp | string, value: string): void {
    this.text = replaceAll(this.text, key, value);
  }

  public toString(): string {
    return this.text;
  }
}