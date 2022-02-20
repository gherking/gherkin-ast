import { GherkinLocation } from "..";
import { normalizeString, replaceAll, GherkinCommentHandler } from "../common";
import { GherkinStep } from "../gherkinObject";
import { Comment } from "./comment";
import { DataTable } from "./dataTable";
import { DocString } from "./docString";
import { UniqueObject } from "./uniqueObject";

export type Argument = DataTable | DocString;

/**
 * Model for Step
 */
export class Step extends UniqueObject {
  public static parse(obj: GherkinStep, comments?: GherkinCommentHandler, prevStepLocation?: GherkinLocation): Step {
    if (!obj || !obj.text) {
      throw new Error("The given object is not a Step!");
    }
    const { keyword, text, dataTable, docString } = obj;
    const step: Step = new Step(keyword, text);

    if (dataTable) {
      step.dataTable = DataTable.parse(dataTable, comments);
    }
    if (docString) {
      step.docString = DocString.parse(docString, comments);
    }

    if (prevStepLocation) {
      step.comment = comments?.parseCommentBetween(prevStepLocation, obj.location);
    } else {
      step.comment = comments?.parseComment(obj.location);
    }

    return step;
  }

  public static parseAll(obj: GherkinStep[], comments?: GherkinCommentHandler): Step[] {
    if (!Array.isArray(obj)) {
      return [];
    }
    let prevStepLocation: GherkinLocation = null;
    return obj.map(o => {
      const step = this.parse(o, comments, prevStepLocation);
      prevStepLocation = o.location;
      return step;
    });
  }

  /** Keyword of the Step */
  public keyword: "Given" | "When" | "Then" | "And" | "But" | "*" | string;
  /** Text of the Step */
  public text: string;
  /** CDataTable of the Step */
  public dataTable: DataTable;
  /** DocString of the Step */
  public docString: DocString;
  /** Comment before the Step */
  public comment: Comment;

  constructor(keyword: string, text: string) {
    super();
    this.keyword = normalizeString(keyword);
    this.text = normalizeString(text);
    this.dataTable = null;
    this.docString = null;
    this.comment = null;
  }

  public clone(): Step {
    const step: Step = new Step(this.keyword, this.text);
    step.dataTable = this.dataTable ? this.dataTable.clone() : null;
    step.docString = this.docString ? this.docString.clone() : null;
    step.comment = this.comment ? this.comment.clone() : null;
    return step;
  }

  public replace(key: RegExp | string, value: string): void {
    this.text = replaceAll(this.text, key, value);
    this.dataTable && this.dataTable.replace(key, value);
    this.docString && this.docString.replace(key, value);
    this.comment && this.comment.replace(key, value);
  }
}
