import { cloneArray, GherkinCommentHandler } from "../common";
import { GherkinBackground } from "../gherkinObject";
import { Element } from "./element";
import { Step } from "./step";
import { getDebugger } from "../debug";
const debug = getDebugger("Background");


/**
 * Model for Background
 */
export class Background extends Element {
  public static parse(obj: GherkinBackground, comments?: GherkinCommentHandler): Background {
    debug("parse(obj: %o, comments: %d)", obj, comments?.comments?.length);
    if (!obj || !obj.background) {
      throw new TypeError("The given object is not a Background!");
    }
    const { keyword, name, description, steps, location } = obj.background;
    const background: Background = new Background(keyword, name, description);

    background.precedingComment = comments?.parseComment(location);

    background.steps = Step.parseAll(steps, comments);

    background.descriptionComment = comments?.parseCommentBetween(location, steps?.[0]?.location);

    debug(
      "parse(this: {keyword: '%s', name: '%s', description: '%s', step: %d, precedingComment: '%s', descriptionComment: '%s'})",
      background.keyword, background.name, background.description, background.steps?.length,
      background.precedingComment?.text, background.descriptionComment?.text,
    );
    return background;
  }

  public clone(): Background {
    debug(
      "clone(this: {keyword: '%s', name: '%s', description: '%s', step: %d, precedingComment: '%s', descriptionComment: '%s'})",
      this.keyword, this.name, this.description, this.steps?.length,
      this.precedingComment?.text, this.descriptionComment?.text,
    );
    const background: Background = new Background(this.keyword, this.name, this.description);

    background.steps = cloneArray<Step>(this.steps);

    background.precedingComment = this.precedingComment ? this.precedingComment.clone() : null;
    background.descriptionComment = this.descriptionComment ? this.descriptionComment.clone() : null;

    return background;
  }
}
